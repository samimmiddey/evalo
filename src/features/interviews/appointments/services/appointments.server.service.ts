import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import { GetAppointmentsParams, GetAppointmentsServerResponse, AppointmentsStatsServerResponse, RetryBookSessionServerResponse, CancelBookingServerResponse } from "../types/appointments.types";
import { Prisma } from "@/generated/prisma/client";
import { StreamClient } from "@stream-io/node-sdk";

export const getAppointments = async (params: GetAppointmentsParams = {}): Promise<GetAppointmentsServerResponse> => {
   const user = await currentUser();

   // Check if user is logged in
   if (!user) {
      return {
         success: false,
         message: "User not logged in"
      };
   }

   try {
      // Fetch db user
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true }
      });

      // Return error if user not found
      if (!dbUser) {
         return {
            success: false,
            message: "User not found"
         };
      }

      const {
         page = 1,
         pageSize = 10,
         search,
         status
      } = params;

      const andConditions: Prisma.BookingWhereInput[] = [
         { intervieweeId: dbUser.id }
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
      if (status) {
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
               feedback: true
            },
            orderBy: {
               startTime: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
         })
      ]);

      return {
         success: true,
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
      return {
         success: false,
         message: "User not logged in",
      };
   }

   try {
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true },
      });

      if (!dbUser) {
         return {
            success: false,
            message: "User not found",
         };
      }

      const stats = await db.booking.groupBy({
         by: ["status"],
         where: {
            intervieweeId: dbUser.id,
         },
         _count: {
            _all: true,
         },
      });

      const completedCount =
         stats.find((item) => item.status === "COMPLETED")?._count._all ?? 0;

      const scheduledCount =
         stats.find((item) => item.status === "SCHEDULED")?._count._all ?? 0;

      const cancelledCount =
         stats.find((item) => item.status === "CANCELLED")?._count._all ?? 0;

      const totalCount =
         completedCount + scheduledCount + cancelledCount;

      const successRate =
         totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

      return {
         success: true,
         data: {
            totalCount,
            completedCount,
            scheduledCount,
            cancelledCount,
            successRate,
         },
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
      return {
         success: false,
         message: "Unauthenticated user"
      };
   }

   // Fetch booking + verify if the current user is allowed to retry it
   const booking = await db.booking.findUnique({
      where: {
         id: bookingId
      },
      include: {
         interviewee: true,
         interviewer: true
      }
   });

   if (!booking) {
      return {
         success: false,
         message: "Booking not found"
      };
   }

   // Make sure the booking belongs to the current user
   if (booking.interviewee.clerkUserId !== user.id &&
      booking.interviewer.clerkUserId !== user.id) {
      return {
         success: false,
         message: "Unauthorized user"
      };
   }

   // Only retry failed stream calls
   if (booking.streamStatus !== 'FAILED') {
      return {
         success: false,
         message: "This meeting does not require a retry"
      };
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
            id: booking.interviewee.clerkUserId,
            name: booking.interviewee.firstName && booking.interviewee.lastName ? `${booking.interviewee.firstName} ${booking.interviewee.lastName}` : 'Interviewee',
            image: booking.interviewee.imageUrl ?? undefined,
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
            created_by_id: booking.interviewee.clerkUserId,
            members: [
               { user_id: booking.interviewee.clerkUserId, role: 'host' },
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
         success: true,
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

// Cancel interview booking
export const cancelBooking = async (bookingId: string): Promise<CancelBookingServerResponse> => {
   const user = await currentUser();

   // Check if user is logged in
   if (!user) {
      return {
         success: false,
         message: "Unauthenticated user",
      };
   }

   // Fetch booking + verify if the current user is allowed to cancel it
   const booking = await db.booking.findUnique({
      where: {
         id: bookingId,
      },
      include: {
         interviewee: true,
         interviewer: true,
      },
   });

   if (!booking) {
      return {
         success: false,
         message: "Booking not found",
      };
   }

   // Make sure the current user is part of this booking
   if (
      booking.interviewee.clerkUserId !== user.id &&
      booking.interviewer.clerkUserId !== user.id
   ) {
      return {
         success: false,
         message: "Unauthorized user",
      };
   }

   // Only scheduled bookings can be cancelled
   if (booking.status !== "SCHEDULED") {
      return {
         success: false,
         message: "This booking cannot be cancelled",
      };
   }

   // Cancel booking and refund credits
   try {
      await db.$transaction(async (tx) => {
         await tx.booking.update({
            where: {
               id: booking.id,
            },
            data: {
               status: "CANCELLED",
            },
         });

         // Record transaction as refund
         await tx.creditTransaction.create({
            data: {
               userId: booking.intervieweeId,
               amount: booking.creditsCharged,
               type: "BOOKING_REFUND",
               bookingId: booking.id,
            },
         });

         // Add credits back to interviewee's balance
         await tx.user.update({
            where: {
               id: booking.intervieweeId,
            },
            data: {
               credits: {
                  increment: booking.creditsCharged,
               },
            },
         });

         // Record transaction as reversal
         await tx.creditTransaction.create({
            data: {
               userId: booking.interviewerId,
               amount: -booking.creditsCharged,
               type: "BOOKING_REVERSAL",
               bookingId: booking.id,
            },
         });

         // Remove credits from interviewer's balance
         await tx.user.update({
            where: {
               id: booking.interviewerId,
            },
            data: {
               credits: {
                  decrement: booking.creditsCharged,
               },
            },
         });
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
      } catch (error: unknown) {
         return serverError({
            error,
            fallbackMessage: "Failed to delete stream call. Please try again later."
         });
      }
   }

   return {
      success: true,
      message: "Booking cancelled successfully.",
   };
};