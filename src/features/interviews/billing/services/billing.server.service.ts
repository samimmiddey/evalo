import { currentUser } from "@clerk/nextjs/server";
import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { apiCashfree } from "@/lib/api-cashfree";
import { SubscriptionStatus } from "@/generated/prisma/enums";
import {
   BillingData,
   BillingPlanInfo,
   CancelSubscriptionResponse,
   CandidateCreditTransaction,
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
   payment_time?: string;
   payment_schedule_date?: string;
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

// Fetch full billing overview for candidate
export const getCandidateBillingData = async (): Promise<BillingData> => {
   try {
      const candidate = await getAuthenticatedCandidate();

      // Query latest subscription for this user
      const latestSub = await db.subscription.findFirst({
         where: { userId: candidate.id },
         orderBy: { createdAt: "desc" }
      });

      // Query candidate credit transactions
      const transactions = await db.creditTransaction.findMany({
         where: { userId: candidate.id },
         orderBy: { createdAt: "desc" },
         take: 50,
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
      });

      // Query Cashfree payments for latest mandate if present
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
                     paymentTime: p.payment_time ?? p.payment_schedule_date ?? new Date().toISOString(),
                     paymentMethod: p.payment_method ?? p.payment_type ?? "AutoPay"
                  };
               });
            }
         } catch {
            // Non-blocking: continue with empty payments list if Cashfree endpoint errors
            payments = [];
         }
      }

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
         status: latestSub ? latestSub.status : "FREE",
         cashfreeSubId: latestSub?.cashfreeSubId ?? null,
         recurringAmount: amount,
         currentPeriodStart: latestSub?.currentPeriodStart?.toISOString() ?? null,
         currentPeriodEnd: latestSub?.currentPeriodEnd?.toISOString() ?? null,
         customerPhone: latestSub?.customerPhone ?? candidate.phone ?? null
      };

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
         plan: planInfo,
         credit: {
            credits: candidate.credits,
            creditsLastAllocatedAt: candidate.creditsLastAllocatedAt?.toISOString() ?? null,
            lastProcessedPeriodStart: candidate.lastProcessedPeriodStart?.toISOString() ?? null
         },
         transactions: mappedTransactions,
         payments
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch candidate billing data"
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