import { NotFoundError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import {
   CreditTransactionRecord,
   PaginatedCreditTransactionsData,
   PaginatedPayoutRecordsData,
   PayoutPaginationParams,
   PayoutRecord,
   PayoutsData,
} from "../types/payout.types";
import {
   RequestPayoutSchemaTypes,
   requestPayoutSchema
} from "../schemas/payout.schemas";
import { getAuthenticatedInterviewer } from "@/features/interviews/shared/services/shared.server.service";

// Get Payouts Overview (Credit Balance)
export const getPayoutsAndTransactions = async (): Promise<PayoutsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      return {
         creditBalance: interviewer.creditBalance
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch payouts overview data"
      });
   }
};

// Get Payout Records (Paginated)
export const getPayoutRecords = async (
   params?: PayoutPaginationParams
): Promise<PaginatedPayoutRecordsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const page = Math.max(1, params?.page ?? 1);
      const pageSize = Math.max(1, params?.pageSize ?? 10);
      const skip = (page - 1) * pageSize;

      const [totalCount, payouts] = await Promise.all([
         db.payout.count({
            where: { interviewerId: interviewer.id }
         }),
         db.payout.findMany({
            where: { interviewerId: interviewer.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
         })
      ]);

      const mappedPayouts: PayoutRecord[] = payouts.map((p) => ({
         id: p.id,
         credits: p.credits,
         platformFee: p.platformFee,
         netAmount: p.netAmount,
         status: p.status,
         adminNote: p.adminNote,
         createdAt: p.createdAt.toISOString(),
         processedAt: p.processedAt ? p.processedAt.toISOString() : null
      }));

      return {
         data: mappedPayouts,
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
         fallbackMessage: "Failed to fetch payout records"
      });
   }
};

// Get Credit Transactions (Paginated)
export const getCreditTransactions = async (
   params?: PayoutPaginationParams
): Promise<PaginatedCreditTransactionsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const page = Math.max(1, params?.page ?? 1);
      const pageSize = Math.max(1, params?.pageSize ?? 10);
      const skip = (page - 1) * pageSize;

      const [totalCount, transactions] = await Promise.all([
         db.creditTransaction.count({
            where: { userId: interviewer.id }
         }),
         db.creditTransaction.findMany({
            where: { userId: interviewer.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
         })
      ]);

      const mappedTransactions: CreditTransactionRecord[] = transactions.map((t) => ({
         id: t.id,
         amount: t.amount,
         type: t.type,
         bookingId: t.bookingId,
         createdAt: t.createdAt.toISOString()
      }));

      return {
         data: mappedTransactions,
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
         fallbackMessage: "Failed to fetch credit transactions"
      });
   }
};

// Request Payout
export const requestPayout = async (
   data: RequestPayoutSchemaTypes
): Promise<{ success: boolean; payoutId: string; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const { credits } = requestPayoutSchema.parse(data);

      if (interviewer.creditBalance < credits) {
         throw new ValidationError(
            `Insufficient credit balance. You have ${interviewer.creditBalance} credits available.`
         );
      }

      const config = await db.platformConfig.findFirst({
         orderBy: { createdAt: "desc" }
      });

      if (!config) {
         throw new NotFoundError("Platform configuration not found");
      }

      const grossAmount = credits * config.creditPayoutRate;
      const platformFee = grossAmount * (config.platformFeePercent / 100);
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
