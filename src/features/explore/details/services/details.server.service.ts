import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { BookSessionParams, InterviewerDetails, InterviewerFeedback } from "../types/details.types";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { v4 as uuidv4 } from 'uuid';
import { checkRateLimit, createRateLimiter } from "@/security/arcjet";
import { request } from "@arcjet/next";

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
         throw new Error('Interviewer not found');
      }

      return interviewer;
   } catch (error: unknown) {
      return serverError(error, 'Failed to fetch interviewer details');
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
         throw new Error('Feedback not found');
      }

      return feedback;
   } catch (error: unknown) {
      return serverError(error, 'Failed to fetch feedback');
   }
};

// 5 bookings per hour
export const bookingLimiter = createRateLimiter({
   refillRate: 5,
   interval: 3600000,
   capacity: 5
});

// Book a call
export const bookSession = async ({ interviewerId, startTime, endTime }: BookSessionParams) => {
   const user = await currentUser();

   if (!user) {
      throw new Error('Unauthenticated user');
   }

   // Arcjet - rate limiter
   const req = await request();
   const rateLimitError = await checkRateLimit(bookingLimiter, req, user.id);

   if (rateLimitError) {
      throw new Error(rateLimitError);
   }

   // Fetch user and interviewer
   const [dbUser, interviewer] = await Promise.all([
      db.user.findUnique({ where: { clerkUserId: user.id } }),
      db.user.findUnique({ where: { id: interviewerId } })
   ]);

   // Check if interviewee exists
   if (dbUser?.role !== 'INTERVIEWEE') {
      throw new Error("Only interviewees can book sessions");
   }

   // Check if interviewer exists
   if (interviewer?.role !== 'INTERVIEWER') {
      throw new Error("Interviewer not found");
   }

   // Credit rate for the interviewer
   const credits = interviewer.creditRate;

   // Check if interviewee has sufficient credit in his account or not
   if (dbUser.credits < credits) {
      throw new Error('Insufficient credits. Please upgrade your plan.');
   }

   // Check if the slot is available
   const conflict = await db.booking.findFirst({
      where: {
         interviewerId,
         status: 'SCHEDULED',
         startTime: { lt: new Date(startTime) },
         endTime: { gt: new Date(endTime) }
      }
   });

   if (conflict) {
      throw new Error("This slot is already booked. Please pick another slot.");
   }

   let booking;
   const streamCallId = uuidv4();

   // Update database
   try {
      booking = await db.$transaction(async (tx) => {
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
      return serverError(error, 'Booking failed. Please try again later.');
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

      // Update stream status on db
      await db.booking.update({
         where: { id: booking.id },
         data: { streamStatus: 'READY' }
      });
   } catch {
      await db.booking.update({
         where: {
            id: booking.id,
         },
         data: {
            streamStatus: "FAILED"
         },
      });
   }

   return { success: true, booking: booking.id, streamCallId };
};