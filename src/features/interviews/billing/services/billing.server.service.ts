import { currentUser } from "@clerk/nextjs/server";
import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { apiCashfree } from "@/lib/api-cashfree";
import { SubscriptionStatus, TransactionType } from "@/generated/prisma/enums";
import {
   BillingData,
   BillingPaginationParams,
   BillingPlanInfo,
   CancelSubscriptionResponse,
   CandidateCreditTransaction,
   CandidatePaymentsData,
   CandidateTransactionsData,
   CashfreePaymentRecord
} from "../types/billing.types";
import { CANCEL_CASHFREE_SUBSCRIPTION, GET_CASHFREE_BILLING_DATA } from "@/constants/query-urls";
import { PRO_PRICE, STARTER_PRICE } from "@/constants/cashfree";

interface RawCashfreePayment {
   cf_payment_id?: string | number;
   payment_id?: string;
   payment_status?: string;
   payment_amount?: number;
   payment_currency?: string;
   payment_initiated_date?: string;
   payment_schedule_date?: string;
   payment_time?: string;
   authorization_details?: {
      authorization_time?: string;
   };
   payment_type?: string;
   payment_method?: string;
}

// Helper to authenticate candidate
export const getAuthenticatedCandidate = async () => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: {
         id: true,
         role: true,
         credits: true,
         currentPlan: true,
         creditsLastAllocatedAt: true,
         lastProcessedPeriodStart: true,
         email: true,
         firstName: true,
         lastName: true,
         phone: true
      }
   });

   if (!dbUser) {
      throw new NotFoundError("User not found");
   }

   if (dbUser.role !== "CANDIDATE") {
      throw new ForbiddenError("Access restricted to candidates");
   }

   return dbUser;
};

// Map slug to human readable name and recurring monthly cost
const getPlanDisplayDetails = (planSlug?: string | null) => {
   const normalized = (planSlug ?? "").toLowerCase();
   if (normalized === "pro") {
      return { planName: "Pro Plan", amount: PRO_PRICE };
   }
   if (normalized === "starter") {
      return { planName: "Starter Plan", amount: STARTER_PRICE };
   }
   return { planName: "Free Tier", amount: 0 };
};

// Fetch billing overview (plan & credits) for candidate
export const getCandidateBillingData = async (): Promise<BillingData> => {
   try {
      const candidate = await getAuthenticatedCandidate();

      // Query latest subscription for this user
      const latestSub = await db.subscription.findFirst({
         where: { userId: candidate.id },
         orderBy: { createdAt: "desc" }
      });

      // Format Plan Details
      const activeOrHeld =
         latestSub &&
         (latestSub.status === SubscriptionStatus.ACTIVE ||
            latestSub.status === SubscriptionStatus.ON_HOLD ||
            latestSub.status === SubscriptionStatus.BANK_APPROVAL_PENDING ||
            latestSub.status === SubscriptionStatus.PAUSED);

      const effectiveSlug = activeOrHeld ? latestSub.planSlug : candidate.currentPlan;
      const { planName, amount } = getPlanDisplayDetails(effectiveSlug);

      const planInfo: BillingPlanInfo = {
         planSlug: effectiveSlug || "free",
         planName,
         status: activeOrHeld ? latestSub.status : "FREE",
         cashfreeSubId: activeOrHeld ? (latestSub?.cashfreeSubId ?? null) : null,
         recurringAmount: amount,
         currentPeriodStart: activeOrHeld ? (latestSub?.currentPeriodStart?.toISOString() ?? null) : null,
         currentPeriodEnd: activeOrHeld ? (latestSub?.currentPeriodEnd?.toISOString() ?? null) : null,
         customerPhone: latestSub?.customerPhone ?? candidate.phone ?? null
      };

      const cycleStart = latestSub?.currentPeriodStart ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      const usedAggregate = await db.creditTransaction.aggregate({
         _sum: { amount: true },
         where: {
            userId: candidate.id,
            OR: [
               { type: TransactionType.BOOKING_DEDUCTION },
               { type: TransactionType.ADMIN_ADJUSTMENT, amount: { lt: 0 } }
            ],
            createdAt: { gte: cycleStart }
         }
      });
      const creditsUsed = Math.abs(usedAggregate._sum.amount ?? 0);

      return {
         plan: planInfo,
         credit: {
            credits: candidate.credits,
            creditsUsed,
            creditsLastAllocatedAt: candidate.creditsLastAllocatedAt?.toISOString() ?? null,
            lastProcessedPeriodStart: candidate.lastProcessedPeriodStart?.toISOString() ?? null
         }
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch candidate billing data"
      });
   }
};

// Fetch paginated candidate credit transactions
export const getCandidateTransactions = async (
   params?: BillingPaginationParams
): Promise<CandidateTransactionsData> => {
   try {
      const candidate = await getAuthenticatedCandidate();
      const page = Math.max(1, params?.page ?? 1);
      const pageSize = Math.max(1, params?.pageSize ?? 10);
      const skip = (page - 1) * pageSize;

      const [totalCount, transactions] = await Promise.all([
         db.creditTransaction.count({
            where: { userId: candidate.id }
         }),
         db.creditTransaction.findMany({
            where: { userId: candidate.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            include: {
               booking: {
                  select: {
                     id: true,
                     interviewer: {
                        select: {
                           firstName: true,
                           lastName: true
                        }
                     }
                  }
               }
            }
         })
      ]);

      const mappedTransactions: CandidateCreditTransaction[] = transactions.map((tx) => {
         let interviewerName: string | null = null;
         if (tx.booking?.interviewer) {
            interviewerName = `${tx.booking.interviewer.firstName ?? ""} ${tx.booking.interviewer.lastName ?? ""}`.trim() || null;
         }

         return {
            id: tx.id,
            amount: tx.amount,
            type: tx.type,
            reason: tx.reason,
            bookingId: tx.bookingId,
            interviewerName,
            createdAt: tx.createdAt.toISOString()
         };
      });

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
         fallbackMessage: "Failed to fetch candidate transactions"
      });
   }
};

// Fetch paginated candidate payments from Cashfree
export const getCandidatePayments = async (
   params?: BillingPaginationParams
): Promise<CandidatePaymentsData> => {
   try {
      const candidate = await getAuthenticatedCandidate();
      const page = Math.max(1, params?.page ?? 1);
      const pageSize = Math.max(1, params?.pageSize ?? 10);

      const latestSub = await db.subscription.findFirst({
         where: { userId: candidate.id },
         orderBy: { createdAt: "desc" }
      });

      let payments: CashfreePaymentRecord[] = [];
      if (latestSub?.cashfreeSubId) {
         try {
            const res = await apiCashfree
               .get(GET_CASHFREE_BILLING_DATA(latestSub.cashfreeSubId))
               .json<RawCashfreePayment[] | { message?: string; code?: string; }>();

            if (Array.isArray(res)) {
               payments = res.map((p) => {
                  const rawStatus = (p.payment_status ?? "SUCCESS").toUpperCase();
                  const paymentStatus: CashfreePaymentRecord["paymentStatus"] =
                     rawStatus === "SUCCESS"
                        ? "SUCCESS"
                        : rawStatus === "FAILED"
                           ? "FAILED"
                           : rawStatus === "CANCELLED"
                              ? "CANCELLED"
                              : "PENDING";

                  return {
                     cfPaymentId: String(p.cf_payment_id ?? p.payment_id ?? ""),
                     paymentId: p.payment_id ?? String(p.cf_payment_id ?? ""),
                     paymentStatus,
                     paymentAmount: typeof p.payment_amount === "number" ? p.payment_amount : 0,
                     paymentCurrency: p.payment_currency ?? "INR",
                     paymentTime:
                        p.payment_initiated_date ??
                        p.authorization_details?.authorization_time ??
                        p.payment_schedule_date ??
                        p.payment_time ??
                        "",
                     paymentMethod: p.payment_method ?? p.payment_type ?? "AutoPay"
                  };
               });
            }
         } catch {
            payments = [];
         }
      }

      const totalCount = payments.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const paginatedPayments = payments.slice(startIndex, startIndex + pageSize);

      return {
         data: paginatedPayments,
         page,
         pageSize,
         totalCount,
         totalPages,
         hasNextPage: page * pageSize < totalCount,
         hasPrevPage: page > 1
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch candidate payments"
      });
   }
};

// Cancel active subscription mandate
export const cancelCandidateSubscription = async (): Promise<CancelSubscriptionResponse> => {
   try {
      const candidate = await getAuthenticatedCandidate();

      const activeSub = await db.subscription.findFirst({
         where: {
            userId: candidate.id,
            status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.ON_HOLD, SubscriptionStatus.PAUSED] }
         },
         orderBy: { createdAt: "desc" }
      });

      if (!activeSub) {
         throw new ValidationError("No active subscription found to cancel");
      }

      // Cancel the mandate at Cashfree so recurring debits stop. Network errors are intentionally NOT caught here: they propagate to the catch so the DB is never marked CANCELLED while the mandate is still live
      const response = await apiCashfree.post(CANCEL_CASHFREE_SUBSCRIPTION(activeSub.cashfreeSubId), {
         json: { action: "CANCEL" }
      });

      if (!response.ok) {
         const errorData = await response.json<{ message?: string; code?: string; }>().catch(() => null);
         const msg = (errorData?.message ?? "").toLowerCase();
         const code = (errorData?.code ?? "").toLowerCase();

         // Already cancelled on Cashfree's side (e.g. via UPI app) is a success for us.
         const isAlreadyCancelled = msg.includes("already cancelled") || code.includes("cancelled");

         if (!isAlreadyCancelled) {
            throw new ValidationError(errorData?.message ?? "Failed to cancel subscription with payment provider");
         }
      }

      // Update local database status
      await db.$transaction(async (tx) => {
         await tx.subscription.update({
            where: { id: activeSub.id },
            data: { status: SubscriptionStatus.CANCELLED }
         });

         // Sync user's current plan to free
         await tx.user.update({
            where: { id: candidate.id },
            data: { currentPlan: "free" }
         });
      });

      return {
         success: true,
         message: "Subscription has been successfully cancelled."
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to cancel subscription"
      });
   }
};