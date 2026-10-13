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
   SubscriptionResponse
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
      const subscriptionId = `sub_${user.id.slice(-8)}_${Date.now()}`;
      const payload = {
         subscription_id: subscriptionId,
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
            payment_methods: ['upi', 'card']
         },
         subscription_meta: {
            return_url: `${process.env.NEXT_PUBLIC_CASHFREE_REDIRECT_URL}/${subscriptionId}`,
            notification_channel: ['EMAIL']
         }
      };

      const res = await apiCashfree.post('/subscriptions', { json: payload }).json<CreateSubscriptionResponse | CashfreeError>();

      if ('code' in res) {
         throw new ValidationError(res.message);
      }

      return {
         subscription_session_id: res.subscription_session_id
      };
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

// Terminal subscription statuses in Cashfree / DB that can never transition back to ACTIVE
const TERMINAL_STATUSES: SubscriptionStatus[] = [
   SubscriptionStatus.CANCELLED,
   SubscriptionStatus.EXPIRED,
   SubscriptionStatus.COMPLETED
];

// Helper to detect if Cashfree rejected cancel because the mandate is already in a terminal/cancelled state or non-existent
const isAlreadyCancelledOrTerminal = (status: number, data: unknown): boolean => {
   // HTTP 404 means the subscription does not exist in Cashfree (terminal / deleted)
   if (status === 404) return true;
   if (typeof data !== 'object' || data === null) return false;
   const record = data as Record<string, unknown>;
   const message = typeof record.message === 'string' ? record.message.toLowerCase() : '';
   const code = typeof record.code === 'string' ? record.code.toLowerCase() : '';
   return (
      code.includes('cancelled') ||
      code.includes('inactive') ||
      code.includes('not_active') ||
      code.includes('not_found') ||
      message.includes('already cancelled') ||
      message.includes('not active') ||
      message.includes('cannot be cancelled') ||
      message.includes('already completed') ||
      message.includes('already expired') ||
      message.includes('does not exist')
   );
};

// Helper to normalize and map Cashfree plan identifiers to local PLAN types ('starter' | 'pro' | 'free')
const resolvePlanSlug = (planId?: string, planName?: string): PLAN => {
   if (planId === STARTER) return 'starter';
   if (planId === PRO) return 'pro';
   const text = `${planId ?? ''} ${planName ?? ''}`.toLowerCase();
   if (text.includes('starter')) return 'starter';
   if (text.includes('pro')) return 'pro';
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

   // Guard: Resolve subscription identifier with fallback
   const subscriptionId = subDetails?.subscription_id ?? payload.data?.subscription_id;
   if (!subscriptionId) {
      // eslint-disable-next-line no-console
      console.warn("Cashfree webhook ignored: missing subscription_id in payload");
      return;
   }

   // EVENT 1: SUBSCRIPTION_STATUS_CHANGED
   // Triggered when mandate status changes: INITIALIZED -> ACTIVE, CANCELLED, etc.
   if (eventType === 'SUBSCRIPTION_STATUS_CHANGED') {
      const rawStatus = (subDetails?.subscription_status ?? payload.data?.subscription_status ?? '').toUpperCase();
      const planSlug = resolvePlanSlug(planDetails?.plan_id, planDetails?.plan_name);
      let subsToCancelInCashfree: string[] = [];

      await db.$transaction(async (tx) => {
         // Sub-flow A: Subscription is ACTIVE (New authorization approved or mandate active)
         if (rawStatus === SubscriptionStatus.ACTIVE) {
            // Guard: Never let a paid ACTIVE event silently become free
            if (planSlug === 'free') {
               // eslint-disable-next-line no-console
               console.error(`Unmapped plan on ACTIVE subscription ${subscriptionId}: ${planDetails?.plan_id}`);
               throw new Error(`Unmapped plan on ACTIVE subscription ${subscriptionId}: ${planDetails?.plan_id}`);
            }

            // Step 1: Resolve the user via existing subscription record first, then fallback to email
            const existingSub = await tx.subscription.findUnique({
               where: { cashfreeSubId: subscriptionId }
            });

            let user = existingSub
               ? await tx.user.findUnique({ where: { id: existingSub.userId } })
               : null;

            if (!user && custDetails?.customer_email) {
               user = await tx.user.findUnique({
                  where: { email: custDetails.customer_email }
               });
            }

            // If user cannot be found, throw so Cashfree retries the webhook
            if (!user) {
               // eslint-disable-next-line no-console
               console.error(`User not found for active subscription ${subscriptionId}`);
               throw new Error(`User not found for subscription ${subscriptionId}`);
            }

            // Safety guard: only candidate accounts can hold subscriptions
            if (user.role !== 'CANDIDATE') {
               // eslint-disable-next-line no-console
               console.warn(`User ${user.id} is not a candidate (role: ${user.role})`);
               return;
            }

            // Concurrency lock: serialize concurrent webhooks for this candidate
            await tx.$executeRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;

            // Step 2: Check existing subscription state
            // CRITICAL GUARD: Never reactivate a subscription that is already in a terminal state (e.g. cancelled after upgrading). Prevents delayed ACTIVE webhooks from resurrecting an old plan and cancelling the candidate's new active plan.
            if (existingSub && TERMINAL_STATUSES.includes(existingSub.status)) {
               // Check if the candidate currently has another active subscription. If so, make sure this old mandate is cancelled in Cashfree so it doesn't linger as an unmanaged live mandate!
               const otherActive = await tx.subscription.findFirst({
                  where: {
                     userId: user.id,
                     status: SubscriptionStatus.ACTIVE,
                     cashfreeSubId: { not: subscriptionId }
                  }
               });

               if (otherActive) {
                  subsToCancelInCashfree.push(subscriptionId);
               }

               // eslint-disable-next-line no-console
               console.warn(`Ignoring ACTIVE event for already terminal subscription ${subscriptionId}`);
               return;
            }

            // Determine if this is the initial activation (currentPeriodStart set on first activation only)
            const isFirstActivation = existingSub?.currentPeriodStart == null;

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
                  currentPeriodStart: existingSub?.currentPeriodStart ?? new Date(),
               }
            });

            // Step 4: Collect previous live/held/paused subscriptions to cancel in Cashfree
            // Only mandates that were actually live/paused should be cancelled via Cashfree manage API.
            const staleSubsToCancelApi = await tx.subscription.findMany({
               where: {
                  userId: user.id,
                  cashfreeSubId: { not: subscriptionId },
                  status: {
                     in: [
                        SubscriptionStatus.ACTIVE,
                        SubscriptionStatus.ON_HOLD,
                        SubscriptionStatus.PAUSED,
                     ]
                  }
               }
            });

            subsToCancelInCashfree = staleSubsToCancelApi.map((s) => s.cashfreeSubId);

            // Clean up any pending bank approval subscriptions locally without calling Cashfree manage API
            await tx.subscription.updateMany({
               where: {
                  userId: user.id,
                  cashfreeSubId: { not: subscriptionId },
                  status: SubscriptionStatus.BANK_APPROVAL_PENDING
               },
               data: { status: SubscriptionStatus.CANCELLED }
            });

            // Step 5: Allocate initial plan credits if this is the first activation
            if (isFirstActivation) {
               const creditsToGrant = PLAN_CREDITS[planSlug];
               const activationTxId = `act_${subscriptionId}`;

               const existingCreditTx = await tx.creditTransaction.findUnique({
                  where: { id: activationTxId }
               });

               if (!existingCreditTx) {
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

                  // Record transaction audit log with deterministic ID to guarantee uniqueness
                  await tx.creditTransaction.create({
                     data: {
                        id: activationTxId,
                        userId: user.id,
                        amount: creditsToGrant,
                        type: 'CREDIT_PURCHASE',
                     }
                  });
               }
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
            const finalStatus =
               rawStatus === SubscriptionStatus.EXPIRED
                  ? SubscriptionStatus.EXPIRED
                  : rawStatus === SubscriptionStatus.COMPLETED
                     ? SubscriptionStatus.COMPLETED
                     : SubscriptionStatus.CANCELLED;

            // Update subscription record to terminal status
            await tx.subscription.updateMany({
               where: { cashfreeSubId: subscriptionId },
               data: { status: finalStatus }
            });

            const existing = await tx.subscription.findUnique({
               where: { cashfreeSubId: subscriptionId }
            });

            if (existing) {
               // Concurrency lock: serialize concurrent webhooks for this user
               await tx.$executeRaw`SELECT id FROM "User" WHERE id = ${existing.userId} FOR UPDATE`;

               // Guard: Check if user has any other active subscription before reverting plan tier
               // Prevents downgrade to 'free' when cancelling an old subscription after upgrading to a new one or re-subscribing to the same plan tier.
               const otherActive = await tx.subscription.findFirst({
                  where: {
                     userId: existing.userId,
                     status: SubscriptionStatus.ACTIVE,
                     cashfreeSubId: { not: subscriptionId }
                  }
               });

               if (!otherActive) {
                  await tx.user.updateMany({
                     where: { id: existing.userId, currentPlan: existing.planSlug },
                     data: { currentPlan: 'free' }
                  });
               }
            }
         }
         // Sub-flow C: Intermediate or hold states (e.g., eNACH bank approval pending, user paused, or card expired)
         else if (
            rawStatus === SubscriptionStatus.BANK_APPROVAL_PENDING ||
            rawStatus === SubscriptionStatus.ON_HOLD ||
            rawStatus === SubscriptionStatus.PAUSED ||
            rawStatus === 'CUSTOMER_PAUSED' ||
            rawStatus === 'CARD_EXPIRED'
         ) {
            const mappedStatus =
               rawStatus === 'CUSTOMER_PAUSED'
                  ? SubscriptionStatus.PAUSED
                  : rawStatus === 'CARD_EXPIRED'
                     ? SubscriptionStatus.ON_HOLD
                     : (rawStatus as SubscriptionStatus);

            // Guard: Never overwrite a terminal subscription back to ON_HOLD or PAUSED
            await tx.subscription.updateMany({
               where: {
                  cashfreeSubId: subscriptionId,
                  status: { notIn: TERMINAL_STATUSES }
               },
               data: { status: mappedStatus }
            });
         }
      });

      // Cancel previous active/held/paused mandates in Cashfree to prevent recurring duplicate charges
      for (const oldSubId of subsToCancelInCashfree) {
         try {
            const response = await apiCashfree.post(`/subscriptions/${oldSubId}/manage`, {
               json: { action: 'CANCEL' },
               throwHttpErrors: false
            });

            if (!response.ok) {
               const errorData = await response.json<Record<string, unknown>>().catch(() => null);
               if (!isAlreadyCancelledOrTerminal(response.status, errorData)) {
                  // eslint-disable-next-line no-console
                  console.error(`Failed to cancel Cashfree subscription ${oldSubId}:`, errorData);
                  // Throw so webhook route returns 500 and Cashfree retries delivery
                  throw new Error(
                     `Failed to cancel previous Cashfree subscription ${oldSubId}: ${JSON.stringify(errorData)}`
                  );
               }
            }

            // Once confirmed cancelled in Cashfree (or already terminal/404), update local DB status
            await db.subscription.updateMany({
               where: { cashfreeSubId: oldSubId },
               data: { status: SubscriptionStatus.CANCELLED }
            });
         } catch (error: unknown) {
            if (error instanceof Error && error.message.startsWith('Failed to cancel')) {
               throw error;
            }
            if (typeof error === 'object' && error !== null && 'response' in error) {
               const errRes = (error as { response: Response; }).response;
               const errData = (await errRes.json().catch(() => null)) as Record<string, unknown> | null;
               if (isAlreadyCancelledOrTerminal(errRes.status, errData)) {
                  await db.subscription.updateMany({
                     where: { cashfreeSubId: oldSubId },
                     data: { status: SubscriptionStatus.CANCELLED }
                  });
                  continue;
               }
            }
            // eslint-disable-next-line no-console
            console.error(`Unexpected error cancelling Cashfree subscription ${oldSubId}:`, error);
            throw error; // Let 500 trigger Cashfree retry
         }
      }

      return;
   }

   // EVENT 2: SUBSCRIPTION_PAYMENT_SUCCESS
   // Triggered on recurring billing cycles (month 2, month 3, etc.)
   if (eventType === 'SUBSCRIPTION_PAYMENT_SUCCESS') {
      const paymentType = (payload.data?.payment_type ?? '').toUpperCase();
      // Guard: Ignore authorization payments (e.g. ₹1 mandate setup), only process real charges
      if (paymentType === 'AUTH') {
         return;
      }

      const rawPaymentTime =
         payload.event_time ??
         payload.data?.payment_time ??
         paymentDetails?.payment_time;

      const paymentTime = rawPaymentTime ? new Date(rawPaymentTime) : new Date();
      if (isNaN(paymentTime.getTime())) {
         // eslint-disable-next-line no-console
         console.warn(`Payment success invalid payment_time: ${rawPaymentTime}`);
         throw new Error(`Invalid payment_time in SUBSCRIPTION_PAYMENT_SUCCESS for ${subscriptionId}`);
      }

      const resolvedPaymentId =
         payload.data?.payment_id ??
         payload.data?.cf_payment_id ??
         paymentDetails?.payment_id;

      // Generate a deterministic reference key for this payment
      const paymentRef = resolvedPaymentId
         ? `pay_${resolvedPaymentId}`
         : `pay_${subscriptionId}_${paymentTime.getTime()}`;

      await db.$transaction(async (tx) => {
         // Step 1: Locate the subscription
         const sub = await tx.subscription.findUnique({
            where: { cashfreeSubId: subscriptionId }
         });

         // If the subscription record does not exist yet (e.g. PAYMENT_SUCCESS arrived before ACTIVE),
         // throw so Cashfree retries the webhook until ACTIVE has committed
         if (!sub) {
            // eslint-disable-next-line no-console
            console.warn(`Payment success received for unknown subscription: ${subscriptionId}. Throwing to trigger retry.`);
            throw new Error(`Subscription ${subscriptionId} not found yet for payment success`);
         }

         // Step 2: Ensure user exists and is a candidate
         const user = await tx.user.findUnique({ where: { id: sub.userId } });
         if (user?.role !== 'CANDIDATE') return;

         // Concurrency lock: serialize concurrent operations for this user
         await tx.$executeRaw`SELECT id FROM "User" WHERE id = ${user.id} FOR UPDATE`;

         // Re-read subscription inside lock to ensure isTerminal is evaluated against fresh state
         const freshSub = await tx.subscription.findUnique({
            where: { id: sub.id }
         });
         if (!freshSub) return;

         const isTerminal = TERMINAL_STATUSES.includes(freshSub.status);
         const planSlug = (freshSub.planSlug as PLAN) || 'starter';
         const creditsToGrant = PLAN_CREDITS[planSlug] || 0;

         // Step 3: Transaction-level idempotency claim
         const existingTx = await tx.creditTransaction.findUnique({
            where: { id: paymentRef }
         });

         // Check if initial cycle credits were already granted for this subscription at activation
         const initialActivationTx = await tx.creditTransaction.findUnique({
            where: { id: `act_${subscriptionId}` }
         });

         // Determine if this payment is the first cycle payment that was already credited at activation
         const alreadyCreditedInitialCycle = Boolean(
            initialActivationTx &&
            freshSub.currentPeriodStart &&
            Math.abs(paymentTime.getTime() - freshSub.currentPeriodStart.getTime()) < 25 * 24 * 60 * 60 * 1000
         );

         if (!existingTx && creditsToGrant > 0) {
            if (!alreadyCreditedInitialCycle) {
               // Grant credits to candidate and record period start (renewal cycles)
               await tx.user.update({
                  where: { id: user.id },
                  data: {
                     credits: { increment: creditsToGrant },
                     creditsLastAllocatedAt: new Date(),
                     lastProcessedPeriodStart: paymentTime,
                  }
               });
            }

            // Record transaction log with deterministic primary key
            await tx.creditTransaction.create({
               data: {
                  id: paymentRef,
                  userId: user.id,
                  amount: alreadyCreditedInitialCycle ? 0 : creditsToGrant,
                  type: 'CREDIT_PURCHASE',
               }
            });
         }

         // Step 4: Never resurrect a cancelled, expired, or completed subscription back to ACTIVE
         await tx.subscription.update({
            where: { id: freshSub.id },
            data: {
               status: isTerminal ? freshSub.status : SubscriptionStatus.ACTIVE,
               currentPeriodStart: paymentTime,
            }
         });
      });
      return;
   }

   // EVENT 3: SUBSCRIPTION_PAYMENT_FAILED
   // Triggered when a recurring charge fails (e.g., insufficient bank funds)
   if (eventType === 'SUBSCRIPTION_PAYMENT_FAILED') {
      const paymentType = (payload.data?.payment_type ?? '').toUpperCase();
      // Guard: Ignore authorization failures (mandate setup), only handle recurring charge failures
      if (paymentType === 'AUTH') {
         return;
      }

      await db.$transaction(async (tx) => {
         const sub = await tx.subscription.findUnique({
            where: { cashfreeSubId: subscriptionId }
         });
         if (!sub) return;

         // Do not overwrite a terminal status (CANCELLED, EXPIRED, COMPLETED) to ON_HOLD
         if (!TERMINAL_STATUSES.includes(sub.status)) {
            await tx.subscription.update({
               where: { id: sub.id },
               data: { status: SubscriptionStatus.ON_HOLD }
            });
         }
      });
      return;
   }
};

// Get subscription details
export const getSubscription = async (id: string): Promise<SubscriptionResponse> => {
   const user = await checkUser();

   // Check if user exists
   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   // Check if user is a candidate
   if (user.role !== 'CANDIDATE') {
      throw new ForbiddenError("Only a candidate can view subscription details");
   }

   try {
      const res = await apiCashfree.get(`/subscriptions/${id}`).json<SubscriptionResponse | CashfreeError>();

      if ('code' in res) {
         throw new ValidationError(res.message);
      }

      return {
         subscription_status: res.subscription_status,
         subscription_id: res.subscription_id
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch subscription details'
      });
   }
};