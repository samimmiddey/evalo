import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import {
   AvailabilitySlot,
   DashboardPayoutsData,
   DashboardSession,
   DashboardSessionsData,
   DashboardStats,
   InterviewerProfileData,
   SessionsFilterParams
} from "../types/dashboard.types";
import {
   CreateAvailabilitySlotsSchemaTypes,
   RequestPayoutSchemaTypes,
   UpdateInterviewerProfileSchemaTypes,
   createAvailabilitySlotsSchema,
   requestPayoutSchema,
   updateInterviewerProfileSchema
} from "../schemas/dashboard.schemas";
import { interviewerDashboardData } from "@/data/dashboard/dashboard.data";
import { Prisma } from "@/generated/prisma/client";

// Helper to authenticate and verify interviewer role
const getAuthenticatedInterviewer = async () => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: {
         id: true,
         role: true,
         creditBalance: true,
         creditRate: true,
         averageRating: true,
         totalRatings: true,
         designation: true,
         company: true,
         experience: true,
         expertise: true,
         bio: true
      }
   });

   if (!dbUser) {
      throw new NotFoundError("User not found");
   }

   if (dbUser.role !== "INTERVIEWER") {
      throw new ForbiddenError("Access restricted to interviewers");
   }

   return dbUser;
};

// Get Dashboard Overview Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const [
         totalSessions,
         completedSessions,
         scheduledSessions,
         cancelledSessions,
         totalEarningsResult,
         nextBooking
      ] = await Promise.all([
         db.booking.count({
            where: { interviewerId: interviewer.id }
         }),
         db.booking.count({
            where: { interviewerId: interviewer.id, status: "COMPLETED" }
         }),
         db.booking.count({
            where: {
               interviewerId: interviewer.id,
               status: "SCHEDULED",
               endTime: { gte: new Date() }
            }
         }),
         db.booking.count({
            where: { interviewerId: interviewer.id, status: "CANCELLED" }
         }),
         db.creditTransaction.aggregate({
            where: {
               userId: interviewer.id,
               type: "BOOKING_EARNING"
            },
            _sum: {
               amount: true
            }
         }),
         db.booking.findFirst({
            where: {
               interviewerId: interviewer.id,
               status: "SCHEDULED",
               endTime: { gte: new Date() }
            },
            orderBy: { startTime: "asc" },
            include: {
               interviewee: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     imageUrl: true,
                     email: true
                  }
               },
               feedback: true
            }
         })
      ]);

      const formattedNextSession: DashboardSession | null = nextBooking
         ? {
            id: nextBooking.id,
            startTime: nextBooking.startTime.toISOString(),
            endTime: nextBooking.endTime.toISOString(),
            status: nextBooking.status,
            streamStatus: nextBooking.streamStatus,
            creditsCharged: nextBooking.creditsCharged,
            streamCallId: nextBooking.streamCallId,
            recordingUrl: nextBooking.recordingUrl,
            candidate: {
               id: nextBooking.interviewee.id,
               firstName: nextBooking.interviewee.firstName,
               lastName: nextBooking.interviewee.lastName,
               imageUrl: nextBooking.interviewee.imageUrl,
               email: nextBooking.interviewee.email
            },
            feedback: nextBooking.feedback
               ? {
                  id: nextBooking.feedback.id,
                  summary: nextBooking.feedback.summary,
                  technical: nextBooking.feedback.technical,
                  communication: nextBooking.feedback.communication,
                  problemSolving: nextBooking.feedback.problemSolving,
                  recommendation: nextBooking.feedback.recommendation,
                  strengths: nextBooking.feedback.strengths,
                  improvements: nextBooking.feedback.improvements,
                  overallRating: nextBooking.feedback.overallRating,
                  sessionRating: nextBooking.feedback.sessionRating,
                  sessionComment: nextBooking.feedback.sessionComment,
                  createdAt: nextBooking.feedback.createdAt.toISOString()
               }
               : null,
            createdAt: nextBooking.createdAt.toISOString()
         }
         : null;

      return {
         totalSessions,
         completedSessions,
         scheduledSessions,
         cancelledSessions,
         totalEarnings: totalEarningsResult._sum.amount ?? 0,
         creditBalance: interviewer.creditBalance,
         creditRate: interviewer.creditRate,
         averageRating: interviewer.averageRating,
         totalRatings: interviewer.totalRatings,
         nextSession: formattedNextSession
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch dashboard stats"
      });
   }
};

// Get Dashboard Booked Sessions
export const getDashboardSessions = async (
   filters?: SessionsFilterParams
): Promise<DashboardSessionsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      const whereClause: Prisma.BookingWhereInput = {
         interviewerId: interviewer.id
      };

      if (filters?.status && filters.status !== "ALL") {
         whereClause.status = filters.status;
      }

      if (filters?.search?.trim()) {
         const searchTerm = filters.search.trim();
         whereClause.interviewee = {
            OR: [
               { firstName: { contains: searchTerm, mode: "insensitive" } },
               { lastName: { contains: searchTerm, mode: "insensitive" } },
               { email: { contains: searchTerm, mode: "insensitive" } }
            ]
         };
      }

      const [totalCount, bookings] = await Promise.all([
         db.booking.count({ where: whereClause }),
         db.booking.findMany({
            where: whereClause,
            orderBy: { startTime: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
               interviewee: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     imageUrl: true,
                     email: true
                  }
               },
               feedback: true
            }
         })
      ]);

      const formattedSessions: DashboardSession[] = bookings.map((item) => ({
         id: item.id,
         startTime: item.startTime.toISOString(),
         endTime: item.endTime.toISOString(),
         status: item.status,
         streamStatus: item.streamStatus,
         creditsCharged: item.creditsCharged,
         streamCallId: item.streamCallId,
         recordingUrl: item.recordingUrl,
         candidate: {
            id: item.interviewee.id,
            firstName: item.interviewee.firstName,
            lastName: item.interviewee.lastName,
            imageUrl: item.interviewee.imageUrl,
            email: item.interviewee.email
         },
         feedback: item.feedback
            ? {
               id: item.feedback.id,
               summary: item.feedback.summary,
               technical: item.feedback.technical,
               communication: item.feedback.communication,
               problemSolving: item.feedback.problemSolving,
               recommendation: item.feedback.recommendation,
               strengths: item.feedback.strengths,
               improvements: item.feedback.improvements,
               overallRating: item.feedback.overallRating,
               sessionRating: item.feedback.sessionRating,
               sessionComment: item.feedback.sessionComment,
               createdAt: item.feedback.createdAt.toISOString()
            }
            : null,
         createdAt: item.createdAt.toISOString()
      }));

      return {
         data: formattedSessions,
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
         fallbackMessage: "Failed to fetch dashboard sessions"
      });
   }
};

// Get Availability Slots
export const getAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const slots = await db.availability.findMany({
         where: {
            interviewerId: interviewer.id,
            endTime: { gte: new Date() }
         },
         orderBy: { startTime: "asc" }
      });

      return slots.map((s) => ({
         id: s.id,
         startTime: s.startTime.toISOString(),
         endTime: s.endTime.toISOString(),
         status: s.status
      }));
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch availability slots"
      });
   }
};

// Create Availability Slots
export const createAvailabilitySlots = async (
   data: CreateAvailabilitySlotsSchemaTypes
): Promise<{ count: number; skipped: number; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const parsed = createAvailabilitySlotsSchema.parse(data);

      const validSlots = parsed.slots
         .map((slot) => ({
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime)
         }))
         .filter((slot) => slot.startTime > new Date() && slot.endTime > slot.startTime);

      if (validSlots.length === 0) {
         throw new ValidationError("No valid future slots provided");
      }

      // Calculate time boundaries of incoming batch
      const minStartTime = new Date(Math.min(...validSlots.map((s) => s.startTime.getTime())));
      const maxEndTime = new Date(Math.max(...validSlots.map((s) => s.endTime.getTime())));

      // Fetch all existing slots for this interviewer that overlap with the batch bounding window
      const existing = await db.availability.findMany({
         where: {
            interviewerId: interviewer.id,
            startTime: { lt: maxEndTime },
            endTime: { gt: minStartTime }
         },
         select: { startTime: true, endTime: true }
      });

      // Filter out slots that overlap with any existing slot:
      // Overlap condition: existing.startTime < candidate.endTime && existing.endTime > candidate.startTime
      const slotsToInsert = validSlots
         .filter((candidate) => {
            const hasOverlap = existing.some(
               (ex) => ex.startTime < candidate.endTime && ex.endTime > candidate.startTime
            );
            return !hasOverlap;
         })
         .map((s) => ({
            interviewerId: interviewer.id,
            startTime: s.startTime,
            endTime: s.endTime,
            status: "AVAILABLE" as const
         }));

      if (slotsToInsert.length === 0) {
         throw new ConflictError("The selected slots already exist or overlap with your existing availability.");
      }

      const result = await db.availability.createMany({
         data: slotsToInsert
      });

      const skippedCount = validSlots.length - result.count;

      return { count: result.count, skipped: skippedCount };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to create availability slots"
      });
   }
};

// Delete Availability Slot
export const deleteAvailabilitySlot = async (slotId: string): Promise<{ success: boolean; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const slot = await db.availability.findUnique({
         where: { id: slotId }
      });

      if (!slot) {
         throw new NotFoundError("Slot not found");
      }

      if (slot.interviewerId !== interviewer.id) {
         throw new ForbiddenError("Unauthorized to delete this slot");
      }

      if (slot.status === "BOOKED") {
         throw new ValidationError("Cannot delete a booked slot. Please cancel the booking first.");
      }

      await db.availability.delete({
         where: { id: slotId }
      });

      return { success: true };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to delete availability slot"
      });
   }
};

// Get Payouts & Credit Transactions
export const getPayoutsAndTransactions = async (): Promise<DashboardPayoutsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const [payouts, transactions] = await Promise.all([
         db.payout.findMany({
            where: { interviewerId: interviewer.id },
            orderBy: { createdAt: "desc" }
         }),
         db.creditTransaction.findMany({
            where: { userId: interviewer.id },
            orderBy: { createdAt: "desc" }
         })
      ]);

      return {
         creditBalance: interviewer.creditBalance,
         ratePerCredit: interviewerDashboardData.payout.ratePerCredit,
         platformFeePercent: interviewerDashboardData.payout.platformFeePercent,
         payouts: payouts.map((p) => ({
            id: p.id,
            credits: p.credits,
            platformFee: p.platformFee,
            netAmount: p.netAmount,
            paymentMethod: p.paymentMethod,
            paymentDetail: p.paymentDetail,
            status: p.status,
            adminNote: p.adminNote,
            createdAt: p.createdAt.toISOString(),
            processedAt: p.processedAt ? p.processedAt.toISOString() : null
         })),
         transactions: transactions.map((t) => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            bookingId: t.bookingId,
            createdAt: t.createdAt.toISOString()
         }))
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch payouts and transactions"
      });
   }
};

// Request Payout
export const requestPayout = async (
   data: RequestPayoutSchemaTypes
): Promise<{ success: boolean; payoutId: string; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const { credits, paymentMethod, paymentDetail } = requestPayoutSchema.parse(data);

      if (interviewer.creditBalance < credits) {
         throw new ValidationError(
            `Insufficient credit balance. You have ${interviewer.creditBalance} credits available.`
         );
      }

      const grossAmount = credits * interviewerDashboardData.payout.ratePerCredit;
      const platformFee = grossAmount * (interviewerDashboardData.payout.platformFeePercent / 100);
      const netAmount = grossAmount - platformFee;

      const payout = await db.$transaction(async (tx) => {
         // Deduct credit balance
         await tx.user.update({
            where: { id: interviewer.id },
            data: {
               creditBalance: {
                  decrement: credits
               }
            }
         });

         // Record Payout
         const newPayout = await tx.payout.create({
            data: {
               interviewerId: interviewer.id,
               credits,
               platformFee,
               netAmount,
               paymentMethod,
               paymentDetail,
               status: "PROCESSING"
            }
         });

         // Record Credit Transaction
         await tx.creditTransaction.create({
            data: {
               userId: interviewer.id,
               amount: -credits,
               type: "ADMIN_ADJUSTMENT"
            }
         });

         return newPayout;
      });

      return { success: true, payoutId: payout.id };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to submit payout request"
      });
   }
};

// Update Interviewer Profile & Rates
export const updateInterviewerProfile = async (
   data: UpdateInterviewerProfileSchemaTypes
): Promise<InterviewerProfileData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const parsed = updateInterviewerProfileSchema.parse(data);

      const updated = await db.user.update({
         where: { id: interviewer.id },
         data: {
            designation: parsed.designation,
            company: parsed.company,
            experience: parsed.experience,
            expertise: parsed.expertise,
            bio: parsed.bio
         },
         select: {
            designation: true,
            company: true,
            experience: true,
            expertise: true,
            bio: true
         }
      });

      return updated;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to update profile"
      });
   }
};
