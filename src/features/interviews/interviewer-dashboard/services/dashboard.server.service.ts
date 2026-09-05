import { ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import {
   DashboardPayoutsData,
   DashboardSessionsData,
   InterviewerProfileData,
   SessionsFilterParams
} from "../types/dashboard.types";
import {
   RequestPayoutSchemaTypes,
   UpdateInterviewerProfileSchemaTypes,
   requestPayoutSchema,
   updateInterviewerProfileSchema
} from "../schemas/dashboard.schemas";
import { interviewerDashboardData } from "@/data/dashboard/dashboard.data";
import { Prisma } from "@/generated/prisma/client";
import { getAuthenticatedInterviewer } from "@/features/interviews/shared/services/shared.server.service";
import { DashboardSession } from "../../shared/types/shared.types";

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
