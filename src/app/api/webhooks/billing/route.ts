import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';

type Plan = 'pro' | 'starter' | 'free';

const PLAN_CREDITS: Record<Plan, number> = {
   pro: 15,
   starter: 5,
   free: 1,
};

const isKnownPlan = (slug: string | undefined): slug is Plan => {
   return slug === 'pro' || slug === 'starter' || slug === 'free';
};

interface SubscriptionItemPayload {
   payer?: {
      user_id?: string;
      organization_id?: string;
   };
   plan?: {
      slug?: string;
   };
   period_start: number;
   period_end: number | null;
   status: string;
}

// Syncs the plan and grants credits for a billing period, safely.
// - Plan is always kept in sync (covers mid-period upgrades/downgrades).
// - Credits are granted at most once per billing period: the period is claimed
//   with a single atomic UPDATE ... WHERE, so retries, duplicate deliveries and
//   concurrent `active` + `updated` events can't double-grant.
// - Only a strictly newer period_start can claim, so stale/out-of-order
//   deliveries can't grant credits or move the cursor backwards.
// - Credits use an atomic increment, so concurrent booking deductions/refunds
//   are never overwritten.
// - The ledger row is written in the same transaction as the credit change.
async function applyPlan(params: {
   userId: string;
   clerkUserId: string;
   planSlug: Plan;
   periodStart: Date;
   creditsToGrant: number;
}) {
   const { userId, clerkUserId, planSlug, periodStart, creditsToGrant } = params;

   await db.$transaction(async (tx) => {
      await tx.user.updateMany({
         where: { clerkUserId, role: { not: 'INTERVIEWER' } },
         data: { currentPlan: planSlug },
      });

      const claimed = await tx.user.updateMany({
         where: {
            clerkUserId,
            role: { not: 'INTERVIEWER' },
            OR: [
               { lastProcessedPeriodStart: null },
               { lastProcessedPeriodStart: { lt: periodStart } },
            ],
         },
         data: {
            credits: { increment: creditsToGrant },
            creditsLastAllocatedAt: new Date(),
            lastProcessedPeriodStart: periodStart,
         },
      });

      // Period already processed (or a stale event): nothing more to do.
      if (claimed.count === 0 || creditsToGrant === 0) return;

      await tx.creditTransaction.create({
         data: {
            userId,
            amount: creditsToGrant,
            type: 'CREDIT_PURCHASE',
         },
      });
   });
}

export async function POST(req: Request) {
   const payload = await req.text();
   const headerPayload = await headers();

   const secret = process.env.CLERK_WEBHOOK_BILLING_SECRET;
   if (!secret) {
      console.error('Missing CLERK_WEBHOOK_BILLING_SECRET');
      return new Response('Server misconfigured', { status: 500 });
   }

   const svixId = headerPayload.get('svix-id');
   const svixTimestamp = headerPayload.get('svix-timestamp');
   const svixSignature = headerPayload.get('svix-signature');

   if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 });
   }

   const wh = new Webhook(secret);

   let evt: WebhookEvent;
   try {
      evt = wh.verify(payload, {
         'svix-id': svixId,
         'svix-timestamp': svixTimestamp,
         'svix-signature': svixSignature,
      }) as WebhookEvent;
   } catch {
      return new Response('Invalid signature', { status: 400 });
   }

   const eventType = evt.type as string;

   // Plan became active / item updated (renewal, upgrade, downgrade, etc.)
   // Both go through the same idempotent path.
   if (eventType === 'subscriptionItem.active' || eventType === 'subscriptionItem.updated') {
      const data = evt.data as unknown as SubscriptionItemPayload;
      const clerkUserId = data.payer?.user_id;
      const planSlug = data.plan?.slug;

      // Ignore org payers, unknown plans, and anything that isn't currently active
      // (e.g. "upcoming" scheduled downgrades, "past_due", "ended").
      if (!clerkUserId || !isKnownPlan(planSlug) || data.status !== 'active') {
         return new Response('OK', { status: 200 });
      }

      const periodStart = new Date(data.period_start);
      if (Number.isNaN(periodStart.getTime())) {
         console.error('Invalid period_start in billing webhook:', data.period_start);
         return new Response('OK', { status: 200 });
      }

      try {
         const dbUser = await db.user.findUnique({ where: { clerkUserId } });

         // 404 on purpose: Svix retries, which covers the case where this event
         // arrives before the user.created webhook has created the row.
         if (!dbUser) {
            return new Response('User not found', { status: 404 });
         }

         if (dbUser.role === 'INTERVIEWER') {
            return new Response('OK', { status: 200 });
         }

         // The initial free subscription gets no credits here:
         // user.created already allocated them.
         const isInitialFree = planSlug === 'free' && dbUser.currentPlan === 'free';
         const creditsToGrant = isInitialFree ? 0 : PLAN_CREDITS[planSlug];

         await applyPlan({
            userId: dbUser.id,
            clerkUserId,
            planSlug,
            periodStart,
            creditsToGrant,
         });
      } catch (error) {
         console.error(`Failed to handle ${eventType}:`, error);
         return new Response('Database error', { status: 500 });
      }
   }

   // Safety net: a paid plan ended. Normally Clerk falls back to the free
   // plan and fires subscriptionItem.active for it, but if not, revert here.
   // Only reverts if the ended plan is still the user's current plan, so an
   // "old item ended" event after an upgrade can't downgrade the user.
   if (eventType === 'subscriptionItem.ended') {
      const data = evt.data as unknown as SubscriptionItemPayload;
      const clerkUserId = data.payer?.user_id;
      const planSlug = data.plan?.slug;

      if (!clerkUserId || !isKnownPlan(planSlug) || planSlug === 'free') {
         return new Response('OK', { status: 200 });
      }

      try {
         await db.user.updateMany({
            where: {
               clerkUserId,
               role: { not: 'INTERVIEWER' },
               currentPlan: planSlug,
            },
            data: { currentPlan: 'free' },
         });
      } catch (error) {
         console.error('Failed to handle subscriptionItem.ended:', error);
         return new Response('Database error', { status: 500 });
      }
   }

   return new Response('OK', { status: 200 });
}