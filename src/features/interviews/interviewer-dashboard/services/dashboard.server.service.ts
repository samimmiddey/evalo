import { ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import {
   DashboardPayoutsData,
} from "../types/dashboard.types";
import {
   RequestPayoutSchemaTypes,
   requestPayoutSchema
} from "../schemas/dashboard.schemas";
import { interviewerDashboardData } from "@/data/dashboard/dashboard.data";
import { getAuthenticatedInterviewer } from "@/features/interviews/shared/services/shared.server.service";

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
