import crypto from "crypto";
import { PRO, STARTER } from "@/constants/cashfree";
import { apiCashfree } from "@/lib/api-cashfree";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import {
   CashfreeError,
   CashfreeSubscriptionWebhookPayload,
   CreateSubscriptionParams,
   CreateSubscriptionResponse,
   Plan,
   PlansResponse,
} from "@/types/cashfree.types";
import { PLAN, PLAN_CREDITS } from "@/types/user.types";
import { SubscriptionStatus } from "@/generated/prisma/enums";
import { currentUser } from "@clerk/nextjs/server";
import { checkUser } from "./user.server.service";

// Fetch Subscription Plans
export const fetchPlans = async (): Promise<PlansResponse> => {
   const user = await currentUser();

   // Check user authentication
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Get plans
   try {
      const [starter, pro] = await Promise.all([
         apiCashfree.get(`/plans/${STARTER}`).json<Plan | CashfreeError>(),
         apiCashfree.get(`/plans/${PRO}`).json<Plan | CashfreeError>()
      ]);

      if ('code' in starter) {
         throw new ValidationError(starter.message);
      }

      if ('code' in pro) {
         throw new ValidationError(pro.message);
      }

      return {
         plans: [starter, pro]
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch subscription plans"
      });
   }
};

// Create a subscription
export const createSubscription = async (plan: CreateSubscriptionParams): Promise<CreateSubscriptionResponse> => {
   const user = await checkUser();

   // Check user authentication
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Allow candidate to subscribe only
   if (user.role !== 'CANDIDATE') {
      throw new ForbiddenError("Only a candidate can subscribe to a plan");
   }

   // Check if the user is not on the same plan already
   if (user.currentPlan.toLowerCase().trim() === plan.name.toLowerCase().trim()) {
      throw new ForbiddenError("You are already on the selected plan");
   }

   try {
      const payload = {
         subscription_id: `sub_${user.id.slice(-8)}_${Date.now()}`,
         customer_details: {
            customer_name: `${user.firstName} ${user.lastName}`,
            customer_email: user.email,
            customer_phone: '9051461078'
         },
         plan_details: {
            plan_id: plan.id
         },
         authorization_details: {
            authorization_amount: 1,
            authorization_amount_refund: false,
            payment_methods: ['enach', 'upi', 'card']
         },
         subscription_meta: {
            return_url: 'http://localhost:3000/payment-success',
            notification_channel: ['EMAIL']
         }
      };

      const res = await apiCashfree.post('/subscriptions', { json: payload }).json<CreateSubscriptionResponse | CashfreeError>();

      if ('code' in res) {
         throw new ValidationError(res.message);
      }

      return res;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to subscribe to the plan"
      });
   }
};

// Validates the HMAC-SHA256 signature attached to incoming Cashfree webhooks
export const verifyCashfreeWebhookSignature = ({
   signature,
   rawBody,
   timestamp,
   secretKey,
}: {
   signature: string;
   rawBody: string;
   timestamp: string;
   secretKey: string;
}): boolean => {
   if (!signature || !timestamp || !secretKey) return false;

   // Step 1: Construct the signed payload string expected by Cashfree
   const signedPayload = timestamp + rawBody;

   // Step 2: Compute expected Base64 HMAC-SHA256 signature
   const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signedPayload)
      .digest('base64');

   const sigBuffer = Buffer.from(signature, 'utf8');
   const expBuffer = Buffer.from(expectedSignature, 'utf8');

   // Step 3: Prevent timing attacks by using constant-time comparison
   if (sigBuffer.length !== expBuffer.length) return false;
   return crypto.timingSafeEqual(sigBuffer, expBuffer);
};

// Helper to normalize and map Cashfree plan identifiers to local PLAN types ('starter' | 'pro' | 'free')
const resolvePlanSlug = (planId?: string, planName?: string): PLAN => {
   const text = `${planId ?? ''} ${planName ?? ''}`.toLowerCase();
   if (text.includes('pro')) return 'pro';
   if (text.includes('starter')) return 'starter';
   return 'free';
};

// Core processor for Cashfree Subscription lifecycle events. Handles three key events:
// 1. SUBSCRIPTION_STATUS_CHANGED: Authorization, first-time activation, cancellation, expiry
// 2. SUBSCRIPTION_PAYMENT_SUCCESS: Subsequent monthly renewal payments (idempotent credit allocation)
// 3. SUBSCRIPTION_PAYMENT_FAILED: Failed renewal debit attempts (flags subscription ON_HOLD)
export const handleCashfreeSubscriptionWebhook = async (
   payload: CashfreeSubscriptionWebhookPayload
): Promise<void> => {
   const eventType = payload.type;
   const subDetails = payload.data?.subscription_details;
   const custDetails = payload.data?.customer_details;
   const planDetails = payload.data?.plan_details;
   const paymentDetails = payload.data?.payment_details;

   // Guard: Ignore events lacking a valid subscription identifier
   if (!subDetails?.subscription_id) return;
   const subscriptionId = subDetails.subscription_id;

   // EVENT 1: SUBSCRIPTION_STATUS_CHANGED
   // Triggered when mandate status changes: INITIALIZED -> ACTIVE, CANCELLED, etc.
   if (eventType === 'SUBSCRIPTION_STATUS_CHANGED') {
      const rawStatus = (subDetails.subscription_status ?? '').toUpperCase();
      const planSlug = resolvePlanSlug(planDetails?.plan_id, planDetails?.plan_name);

      await db.$transaction(async (tx) => {
         // Sub-flow A: Subscription is ACTIVE (New authorization approved or mandate active)
         if (rawStatus === SubscriptionStatus.ACTIVE) {
            // Step 1: Resolve the user by customer email provided in webhook
            let user = null;
            if (custDetails?.customer_email) {
               user = await tx.user.findUnique({
                  where: { email: custDetails.customer_email }
               });
            }

            // Fallback: If email lookup fails, look up the existing subscription's linked user
            if (!user) {
               const existing = await tx.subscription.findUnique({
                  where: { cashfreeSubId: subscriptionId }
               });
               if (existing) {
                  user = await tx.user.findUnique({ where: { id: existing.userId } });
               }
            }

            // Safety guard: only candidate accounts can hold subscriptions
            if (user?.role !== 'CANDIDATE') return;

            // Step 2: Determine if this is the initial activation (to prevent duplicate first-cycle credits)
            const existingSub = await tx.subscription.findUnique({
               where: { cashfreeSubId: subscriptionId }
            });
            const isFirstActivation = existingSub?.status !== SubscriptionStatus.ACTIVE;

            // Step 3: Upsert the subscription model in the database
            await tx.subscription.upsert({
               where: { cashfreeSubId: subscriptionId },
               create: {
                  userId: user.id,
                  cashfreeSubId: subscriptionId,
                  cashfreePlanId: planDetails?.plan_id ?? '',
                  planSlug,
                  status: SubscriptionStatus.ACTIVE,
                  customerPhone: custDetails?.customer_phone ?? null,
                  currentPeriodStart: new Date(),
               },
               update: {
                  status: SubscriptionStatus.ACTIVE,
                  planSlug,
                  currentPeriodStart: new Date(),
               }
            });

            // Step 4: Allocate initial plan credits if this is the first activation
            if (isFirstActivation && planSlug !== 'free') {
               const creditsToGrant = PLAN_CREDITS[planSlug];

               // Update candidate plan, add credits, and record period start
               await tx.user.update({
                  where: { id: user.id },
                  data: {
                     currentPlan: planSlug,
                     credits: { increment: creditsToGrant },
                     creditsLastAllocatedAt: new Date(),
                     lastProcessedPeriodStart: new Date(),
                  }
               });

               // Record transaction audit log for credit purchase
               await tx.creditTransaction.create({
                  data: {
                     userId: user.id,
                     amount: creditsToGrant,
                     type: 'CREDIT_PURCHASE',
                  }
               });
            } else {
               // If already active or switching plans without re-crediting, sync user's current plan
               await tx.user.update({
                  where: { id: user.id },
                  data: { currentPlan: planSlug }
               });
            }
         }
         // Sub-flow B: Subscription was cancelled, expired, or completed
         else if (
            rawStatus === SubscriptionStatus.CANCELLED ||
            rawStatus === SubscriptionStatus.EXPIRED ||
            rawStatus === 'CUSTOMER_CANCELLED' ||
            rawStatus === SubscriptionStatus.COMPLETED
         ) {
            // Update subscription record to CANCELLED
            await tx.subscription.updateMany({
               where: { cashfreeSubId: subscriptionId },
               data: { status: SubscriptionStatus.CANCELLED }
            });

            // Revert candidate's plan tier to 'free' (remaining credits are retained)
            const existing = await tx.subscription.findUnique({
               where: { cashfreeSubId: subscriptionId }
            });

            if (existing) {
               await tx.user.updateMany({
                  where: { id: existing.userId, currentPlan: existing.planSlug },
                  data: { currentPlan: 'free' }
               });
            }
         }
         // Sub-flow C: Intermediate or hold states (e.g., eNACH bank approval pending or user paused)
         else if (
            rawStatus === SubscriptionStatus.BANK_APPROVAL_PENDING ||
            rawStatus === SubscriptionStatus.ON_HOLD ||
            rawStatus === SubscriptionStatus.PAUSED
         ) {
            await tx.subscription.updateMany({
               where: { cashfreeSubId: subscriptionId },
               data: { status: rawStatus }
            });
         }
      });
      return;
   }

   // EVENT 2: SUBSCRIPTION_PAYMENT_SUCCESS
   // Triggered on recurring billing cycles (month 2, month 3, etc.)
   if (eventType === 'SUBSCRIPTION_PAYMENT_SUCCESS') {
      const paymentTime = paymentDetails?.payment_time
         ? new Date(paymentDetails.payment_time)
         : new Date();

      await db.$transaction(async (tx) => {
         // Step 1: Locate the active subscription
         const sub = await tx.subscription.findUnique({
            where: { cashfreeSubId: subscriptionId }
         });
         if (!sub) return;

         // Step 2: Ensure user exists and is a candidate
         const user = await tx.user.findUnique({ where: { id: sub.userId } });
         if (user?.role !== 'CANDIDATE') return;

         const planSlug = (sub.planSlug as PLAN) || 'starter';
         const creditsToGrant = PLAN_CREDITS[planSlug] || 0;

         // Step 3: Idempotent period claim.
         // Atomically checks if this period payment was already processed
         // If `lastProcessedPeriodStart` is already >= `paymentTime`, this query updates 0 rows
         // preventing duplicate credits if Cashfree delivers this webhook multiple times
         const claimed = await tx.user.updateMany({
            where: {
               id: user.id,
               role: 'CANDIDATE',
               OR: [
                  { lastProcessedPeriodStart: null },
                  { lastProcessedPeriodStart: { lt: paymentTime } }
               ]
            },
            data: {
               credits: { increment: creditsToGrant },
               creditsLastAllocatedAt: new Date(),
               lastProcessedPeriodStart: paymentTime,
            }
         });

         // Step 4: If claimed successfully, record transaction log and update subscription period
         if (claimed.count > 0 && creditsToGrant > 0) {
            await tx.creditTransaction.create({
               data: {
                  userId: user.id,
                  amount: creditsToGrant,
                  type: 'CREDIT_PURCHASE',
               }
            });

            await tx.subscription.update({
               where: { id: sub.id },
               data: {
                  status: SubscriptionStatus.ACTIVE,
                  currentPeriodStart: paymentTime,
               }
            });
         }
      });
      return;
   }

   // EVENT 3: SUBSCRIPTION_PAYMENT_FAILED
   // Triggered when a recurring charge fails (e.g., insufficient bank funds)
   if (eventType === 'SUBSCRIPTION_PAYMENT_FAILED') {
      await db.$transaction(async (tx) => {
         // Mark subscription ON_HOLD until payment succeeds on retry or is resolved
         await tx.subscription.updateMany({
            where: { cashfreeSubId: subscriptionId },
            data: { status: SubscriptionStatus.ON_HOLD }
         });
      });
      return;
   }
};