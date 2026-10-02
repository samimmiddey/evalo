import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import { GetAppointmentsParams, GetAppointmentsServerResponse, AppointmentsStatsServerResponse, RetryBookSessionServerResponse } from "../types/appointments.types";
import { Prisma } from "@/generated/prisma/client";
import { StreamClient } from "@stream-io/node-sdk";
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { rateInterviewerSchema, RateInterviewerSchemaTypes } from "../schemas/appointments.schemas";

export const getAppointments = async (params: GetAppointmentsParams = {}): Promise<GetAppointmentsServerResponse> => {
   const user = await currentUser();

   // Check if user is logged in
   if (!user) {
      throw new UnauthorizedError('User not logged in');
   }

   try {
      // Fetch db user
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true }
      });

      // Return error if user not found
      if (!dbUser) {
         throw new NotFoundError('User not found');
      }

      const {
         page = 1,
         pageSize = 10,
         search,
         status
      } = params;

      const andConditions: Prisma.BookingWhereInput[] = [
         { candidateId: dbUser.id }
      ];

      // If search is present, add search condition
      if (search) {
         andConditions.push({
            interviewer: {
               OR: [
                  { firstName: { contains: search, mode: 'insensitive' } },
                  { lastName: { contains: search, mode: 'insensitive' } },
                  { company: { contains: search, mode: 'insensitive' } },
                  { designation: { contains: search, mode: 'insensitive' } }
               ]
            }
         });
      }

      // If status is present, add status condition
      if (status === 'SCHEDULED') {
         andConditions.push({
            status: 'SCHEDULED',
            endTime: { gte: new Date() }
         });
      } else if (status) {
         andConditions.push({
            status
         });
      }

      const where: Prisma.BookingWhereInput = { AND: andConditions };

      // Get total count and appointments
      const [totalCount, appointments] = await Promise.all([
         db.booking.count({ where }),
         db.booking.findMany({
            where,
            include: {
               interviewer: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     email: true,
                     imageUrl: true,
                     designation: true,
                     company: true,
                     experience: true,
                     expertise: true,
                     creditRate: true,
                     averageRating: true,
                     totalRatings: true
                  }
               },
               feedback: true,
               review: true
            },
            orderBy: {
               startTime: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
         })
      ]);

      return {
         data: appointments,
         page,
         pageSize,
         totalCount,
         totalPages: Math.ceil(totalCount / pageSize),
         hasNextPage: page * pageSize < totalCount,
         hasPrevPage: page > 1
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch appointments'
      });
   }
};

// Get appointments stats
export const getAppointmentStats = async (): Promise<AppointmentsStatsServerResponse> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError('User not logged in');
   }

   try {
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true },
      });

      if (!dbUser) {
         throw new NotFoundError('User not found');
      }

      const now = new Date();

      const [completedCount, scheduledCount, cancelledCount] = await Promise.all([
         db.booking.count({
            where: {
               candidateId: dbUser.id,
               status: "COMPLETED",
            },
         }),
         db.booking.count({
            where: {
               candidateId: dbUser.id,
               status: "SCHEDULED",
               endTime: { gte: now },
            },
         }),
         db.booking.count({
            where: {
               candidateId: dbUser.id,
               status: "CANCELLED",
            },
         }),
      ]);

      const totalCount =
         completedCount + scheduledCount + cancelledCount;

      const successRate =
         totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

      return {
         totalCount,
         completedCount,
         scheduledCount,
         cancelledCount,
         successRate,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch appointment stats'
      });
   }
};

// Retry booking stream call
export const retryStreamCall = async (bookingId: string): Promise<RetryBookSessionServerResponse> => {
   const user = await currentUser();

   // Check if the user exists
   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   // Fetch booking + verify if the current user is allowed to retry it
   const booking = await db.booking.findUnique({
      where: {
         id: bookingId
      },
      include: {
         candidate: true,
         interviewer: true
      }
   });

   if (!booking) {
      throw new NotFoundError('Booking not found');
   }

   // Make sure the booking belongs to the current user
   if (booking.candidate.clerkUserId !== user.id &&
      booking.interviewer.clerkUserId !== user.id) {
      throw new UnauthorizedError('Unauthorized user');
   }

   // Only retry failed stream calls
   if (booking.streamStatus !== 'FAILED') {
      throw new ForbiddenError("This meeting does not require a retry");
   }

   try {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      const secretKey = process.env.STREAM_SECRET_KEY;

      if (!apiKey || !secretKey) {
         throw new Error("Missing Stream environment variables");
      }

      const streamClient = new StreamClient(apiKey, secretKey);

      // Store users on stream
      await streamClient.upsertUsers([
         {
            id: booking.candidate.clerkUserId,
            name: booking.candidate.firstName && booking.candidate.lastName ? `${booking.candidate.firstName} ${booking.candidate.lastName}` : 'Candidate',
            image: booking.candidate.imageUrl ?? undefined,
            role: 'user'
         },
         {
            id: booking.interviewer.clerkUserId,
            name: booking.interviewer.firstName && booking.interviewer.lastName ? `${booking.interviewer.firstName} ${booking.interviewer.lastName}` : 'Interviewer',
            image: booking.interviewer.imageUrl ?? undefined,
            role: 'user'
         }
      ]);

      const call = streamClient.video.call("default", booking.streamCallId!);

      // Create call
      await call.getOrCreate({
         data: {
            created_by_id: booking.candidate.clerkUserId,
            members: [
               { user_id: booking.candidate.clerkUserId, role: 'host' },
               { user_id: booking.interviewer.clerkUserId, role: 'host' },
            ],
            settings_override: {
               recording: { mode: 'available', quality: '1080p' },
               screensharing: { enabled: true },
               transcription: { mode: 'auto-on' }
            }
         }
      });

      const updated = await db.booking.update({
         where: { id: booking.id },
         data: { streamStatus: 'READY' }
      });

      return {
         streamCallId: booking.streamCallId,
         streamStatus: updated.streamStatus
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "We couldn't prepare the meeting room. Please try again."
      });
   }
};

type BookingWithParties = Prisma.BookingGetPayload<{
   include: { candidate: true; interviewer: true; };
}>;

// Cancel interview booking
export const cancelBooking = async (bookingId: string): Promise<void> => {
   const user = await currentUser();

   // Check if user is logged in
   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   let booking: BookingWithParties;

   // Cancel booking and refund credits
   try {
      // Fetch booking + verify if the current user is allowed to cancel it
      const found = await db.booking.findUnique({
         where: {
            id: bookingId,
         },
         include: {
            candidate: true,
            interviewer: true,
         },
      });

      if (!found) {
         throw new NotFoundError("Booking not found");
      }

      booking = found;

      // Make sure the current user is part of this booking
      if (
         booking.candidate.clerkUserId !== user.id &&
         booking.interviewer.clerkUserId !== user.id
      ) {
         throw new UnauthorizedError("Unauthorized user");
      }

      // Only scheduled bookings before slot end time can be cancelled
      if (booking.status !== "SCHEDULED" || new Date(booking.endTime) <= new Date()) {
         throw new ForbiddenError("Bookings cannot be cancelled after the session end time");
      }

      const now = new Date();
      await db.$transaction(async (tx) => {
         const { count } = await tx.booking.updateMany({
            where: {
               id: booking.id,
               status: "SCHEDULED",
               isRefunded: false,
               endTime: { gt: now }
            },
            data: {
               status: "CANCELLED",
               isRefunded: true
            },
         });

         if (count === 0) {
            throw new ConflictError("This booking cannot be cancelled or was already processed");
         }

         // Record transaction as refund
         await tx.creditTransaction.create({
            data: {
               userId: booking.candidateId,
               amount: booking.creditsCharged,
               type: "BOOKING_REFUND",
               bookingId: booking.id,
            },
         });

         // Add credits back to candidate's balance
         await tx.user.update({
            where: {
               id: booking.candidateId,
            },
            data: {
               credits: {
                  increment: booking.creditsCharged,
               },
            },
         });

         // If future availability slot exists, restore it to AVAILABLE
         const availability = await tx.availability.findFirst({
            where: {
               interviewerId: booking.interviewerId,
               startTime: booking.startTime,
               endTime: booking.endTime,
               status: 'BOOKED',
            },
         });

         if (availability && availability.startTime > new Date()) {
            await tx.availability.update({
               where: { id: availability.id },
               data: { status: 'AVAILABLE' },
            });
         }
      });
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to cancel booking. Please try again later."
      });
   }

   // Stream cleanup is separate from the database transaction
   if (booking.streamStatus === "READY" && booking.streamCallId) {
      try {
         const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
         const secretKey = process.env.STREAM_SECRET_KEY;

         if (!apiKey || !secretKey) {
            throw new Error("Missing Stream environment variables");
         }

         const streamClient = new StreamClient(apiKey, secretKey);

         const call = streamClient.video.call(
            "default",
            booking.streamCallId
         );

         await call.delete();
      } catch {
         // Booking is already cancelled in the DB. Stream cleanup failing
         // doesn't affect the outcome for the user — nothing to do here.
      }
   }
};

// Claim refund for an expired interview booking
export const claimRefund = async (bookingId: string): Promise<void> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("User not logged in");
   }

   try {
      const booking = await db.booking.findUnique({
         where: { id: bookingId },
         include: {
            candidate: { select: { clerkUserId: true } },
            transactions: { where: { type: 'BOOKING_REFUND' } }
         }
      });

      if (!booking) {
         throw new NotFoundError("Booking not found");
      }

      // Ensure user is the candidate for this booking
      if (booking.candidate.clerkUserId !== user.id) {
         throw new UnauthorizedError("Only the candidate can claim a refund for this session");
      }

      // Ensure booking is not completed, cancelled, or settled with a completion reason
      if (booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.completionReason !== null) {
         throw new ForbiddenError("Completed, cancelled, or no-show compensated sessions cannot be refunded.");
      }

      // Ensure booking is expired (past endTime + 15 mins grace period)
      const isPastDue = Date.now() > (new Date(booking.endTime).getTime() + 15 * 60 * 1000);
      if (booking.status !== "EXPIRED" && !(booking.status === "SCHEDULED" && isPastDue)) {
         throw new ForbiddenError("This session is still under review or active. Refunds can only be claimed after the 15-minute settlement window.");
      }

      // Ensure refund hasn't already been processed
      if (booking.isRefunded || (booking.transactions && booking.transactions.length > 0)) {
         throw new ConflictError("Refund has already been claimed for this booking");
      }

      await db.$transaction(async (tx) => {
         // Database-level concurrency guard: atomically check isRefunded: false, status, and completionReason is null
         const { count } = await tx.booking.updateMany({
            where: {
               id: booking.id,
               isRefunded: false,
               completionReason: null,
               status: { in: ["SCHEDULED", "EXPIRED"] }
            },
            data: {
               status: "EXPIRED",
               isRefunded: true
            }
         });

         if (count === 0) {
            throw new ConflictError("This booking was already refunded, completed, or cancelled");
         }

         // Record refund transaction
         await tx.creditTransaction.create({
            data: {
               userId: booking.candidateId,
               amount: booking.creditsCharged,
               type: "BOOKING_REFUND",
               bookingId: booking.id
            }
         });

         // Add credits back to candidate's balance
         await tx.user.update({
            where: { id: booking.candidateId },
            data: {
               credits: {
                  increment: booking.creditsCharged
               }
            }
         });
      });
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to claim refund. Please try again later."
      });
   }
};

// Rate interviewer session
export const rateInterviewer = async (
   data: RateInterviewerSchemaTypes
): Promise<{ success: true; }> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("User not logged in");
   }

   try {
      const { bookingId, rating, comment } = rateInterviewerSchema.parse(data);

      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true }
      });

      if (!dbUser) {
         throw new NotFoundError("User not found");
      }

      const booking = await db.booking.findUnique({
         where: { id: bookingId },
         include: {
            review: true
         }
      });

      if (!booking) {
         throw new NotFoundError("Booking not found");
      }

      if (booking.candidateId !== dbUser.id) {
         throw new ForbiddenError("You are not authorized to rate this session");
      }

      if (booking.status !== "COMPLETED") {
         throw new ValidationError("You can only rate completed interview sessions");
      }

      if (booking.review) {
         throw new ConflictError("This session has already been rated");
      }

      await db.$transaction(async (tx) => {
         // Create review record with rating & comment
         await tx.review.create({
            data: {
               bookingId: booking.id,
               rating,
               comment: comment?.trim() || null
            }
         });

         // Recalculate average rating & total count for the interviewer
         const reviewList = await tx.review.findMany({
            where: {
               booking: {
                  interviewerId: booking.interviewerId,
                  status: "COMPLETED"
               }
            },
            select: { rating: true }
         });

         const totalRatings = reviewList.length;
         const totalScore = reviewList.reduce((acc, r) => acc + r.rating, 0);
         const averageRating = totalRatings > 0 ? parseFloat((totalScore / totalRatings).toFixed(1)) : null;

         await tx.user.update({
            where: { id: booking.interviewerId },
            data: {
               averageRating,
               totalRatings
            }
         });
      });

      return { success: true };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to submit rating. Please try again later."
      });
   }
};