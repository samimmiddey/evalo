import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { BookSessionParams, BookSessionSetupResponse, InterviewerDetails, InterviewerFeedback } from "../types/details.types";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, createRateLimiter } from "@/security/arcjet";
import { request } from "@arcjet/next";
import { ConflictError, ForbiddenError, NotFoundError, RateLimitError, UnauthorizedError, ValidationError } from "@/lib/app-error";

// Get interviwer details
export const getInterviewerDetails = async (id: string): Promise<InterviewerDetails> => {
   try {
      const interviewer = await db.user.findUnique({
         where: { id: id, role: 'INTERVIEWER' },
         select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            designation: true,
            company: true,
            expertise: true,
            experience: true,
            bio: true,
            creditRate: true,
            averageRating: true,
            totalRatings: true,
            currentPlan: true,
            availabilities: {
               where: { status: 'AVAILABLE' },
               select: { startTime: true, endTime: true },
               take: 1
            },
            bookingsAsInterviewer: {
               where: { status: "SCHEDULED" },
               select: { startTime: true, endTime: true }
            }
         }
      });

      if (!interviewer) {
         throw new NotFoundError('Interviewer not found');
      }

      return interviewer;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch interviewer details'
      });
   }
};

export const getFeedback = async (id: string): Promise<InterviewerFeedback> => {
   try {
      const feedback = await db.user.findUnique({
         where: { id: id, role: 'INTERVIEWER' },
         select: {
            bookingsAsInterviewer: {
               where: { status: "COMPLETED", feedback: { isNot: null } },
               select: {
                  id: true,
                  interviewee: {
                     select: {
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        designation: true,
                        createdAt: true,
                        company: true
                     }
                  },
                  feedback: {
                     select: {
                        sessionRating: true,
                        sessionComment: true
                     }
                  }
               }
            }
         }
      });

      if (!feedback) {
         throw new NotFoundError('Feedback not found');
      }

      return feedback;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch feedback'
      });
   }
};

// 5 bookings per hour
export const bookingLimiter = createRateLimiter({
   refillRate: 5,
   interval: 3600000,
   capacity: 5
});

// Book a call
export const bookSession = async ({ interviewerId, startTime, endTime }: BookSessionParams): Promise<BookSessionSetupResponse> => {
   const user = await currentUser();

   // Check if user eixsts
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Arcjet - rate limiter
   const req = await request();
   const rateLimitError = await checkRateLimit(bookingLimiter, req, user.id);

   // Check rate limit
   if (rateLimitError) {
      throw new RateLimitError(rateLimitError);
   }

   // Fetch user and interviewer
   const [dbUser, interviewer] = await Promise.all([
      db.user.findUnique({ where: { clerkUserId: user.id } }),
      db.user.findUnique({ where: { id: interviewerId } })
   ]);

   // Check if interviewee exists
   if (dbUser?.role !== 'INTERVIEWEE') {
      throw new ForbiddenError("Only interviewees can book sessions");
   }

   // Check if interviewer exists
   if (interviewer?.role !== 'INTERVIEWER') {
      throw new NotFoundError("Interviewer not found");
   }

   // Credit rate for the interviewer
   const credits = interviewer.creditRate;

   // Check if interviewee has sufficient credit in his account or not
   if (dbUser.credits < credits) {
      throw new ValidationError("Insufficient credits. Please upgrade your plan.");
   }

   let booking;
   const streamCallId = uuidv4();

   // Update database
   try {
      booking = await db.$transaction(async (tx) => {
         // Check if the slot is available
         const conflict = await tx.booking.findFirst({
            where: {
               interviewerId,
               status: 'SCHEDULED',
               startTime: { lt: new Date(endTime) },
               endTime: { gt: new Date(startTime) }
            }
         });

         if (conflict) {
            throw new ConflictError("This slot is already booked. Please pick another slot.");
         }

         const newBooking = await tx.booking.create({
            data: {
               intervieweeId: dbUser.id,
               interviewerId,
               startTime: new Date(startTime),
               endTime: new Date(endTime),
               status: 'SCHEDULED',
               streamStatus: 'PENDING',
               creditsCharged: credits,
               streamCallId
            }
         });

         await tx.creditTransaction.create({
            data: {
               userId: dbUser.id,
               amount: -credits,
               type: "BOOKING_DEDUCTION",
               bookingId: newBooking.id
            }
         });

         await tx.user.update({
            where: { id: dbUser.id },
            data: { credits: { decrement: credits } }
         });

         await tx.creditTransaction.create({
            data: {
               userId: interviewerId,
               amount: +credits,
               type: "BOOKING_EARNING",
               bookingId: newBooking.id
            }
         });

         await tx.user.update({
            where: { id: interviewerId },
            data: { credits: { increment: credits } }
         });

         return newBooking;
      });
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Booking failed. Please try again later.'
      });
   }

   // Create stream call
   try {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      const secretKey = process.env.STREAM_SECRET_KEY;

      if (!apiKey || !secretKey) {
         throw new Error("Missing stream environment variables");
      }

      const streamClient = new StreamClient(apiKey, secretKey);

      // Store users on stream
      await streamClient.upsertUsers([
         {
            id: dbUser.clerkUserId,
            name: dbUser.firstName && dbUser.lastName ? `${dbUser.firstName} ${dbUser.lastName}` : 'Interviewee',
            image: dbUser.imageUrl ?? undefined,
            role: 'user'
         },
         {
            id: interviewer.clerkUserId,
            name: interviewer.firstName && interviewer.lastName ? `${interviewer.firstName} ${interviewer.lastName}` : 'Interviewer',
            image: interviewer.imageUrl ?? undefined,
            role: 'user'
         }
      ]);

      const call = streamClient.video.call("default", streamCallId);

      // Create call
      await call.getOrCreate({
         data: {
            created_by_id: dbUser.clerkUserId,
            members: [
               { user_id: dbUser.clerkUserId, role: 'host' },
               { user_id: interviewer.clerkUserId, role: 'host' },
            ],
            settings_override: {
               recording: { mode: 'available', quality: '1080p' },
               screensharing: { enabled: true },
               transcription: { mode: 'auto-on' }
            }
         }
      });
   } catch {
      const updated = await db.booking.update({
         where: {
            id: booking.id,
         },
         data: {
            streamStatus: "FAILED"
         },
      });

      booking = updated;

      return {
         booking: booking.id,
         streamCallId,
         streamStatus: booking.streamStatus,
      };
   }

   // Update stream status on db
   try {
      const updated = await db.booking.update({
         where: { id: booking.id },
         data: { streamStatus: 'READY' }
      });

      booking = updated;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Booking failed. Please try again later.'
      });
   }

   return {
      booking: booking.id,
      streamCallId,
      streamStatus: booking.streamStatus
   };
};