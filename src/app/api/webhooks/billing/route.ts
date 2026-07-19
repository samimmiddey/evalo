import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';

type Plan = "pro" | "starter" | "free";

const PLAN_CREDITS: Record<Plan, number> = {
   pro: 15,
   starter: 5,
   free: 1,
};

const isKnownPlan = (slug: string | undefined): slug is Plan => {
   return slug === 'pro' || slug === 'starter' || slug === 'free';
};

interface SubscriptionItemPayload {
   payer: {
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

export async function POST(req: Request) {
   const payload = await req.text();
   const headerPayload = await headers();

   const secret = process.env.CLERK_WEBHOOK_BILLING_SECRET;

   if (!secret) {
      throw new Error("Missing CLERK_WEBHOOK_BILLING_SECRET");
   };

   const wh = new Webhook(secret);

   let evt: WebhookEvent;
   try {
      evt = wh.verify(payload, {
         'svix-id': headerPayload.get('svix-id')!,
         'svix-timestamp': headerPayload.get('svix-timestamp')!,
         'svix-signature': headerPayload.get('svix-signature')!,
      }) as WebhookEvent;
   } catch {
      return new Response('Invalid signature', { status: 400 });
   }

   // Plan became active — first subscription, upgrade, downgrade, or reactivation.
   if (evt.type === 'subscriptionItem.active') {
      const data = evt.data as unknown as SubscriptionItemPayload;
      const clerkUserId = data.payer?.user_id;
      const planSlug = data.plan?.slug;

      if (!clerkUserId || !isKnownPlan(planSlug)) {
         return new Response('OK', { status: 200 });
      }

      try {
         const dbUser = await db.user.findUnique({ where: { clerkUserId } });

         if (!dbUser) {
            return new Response('User not found', { status: 404 });
         }

         if (dbUser.role === "INTERVIEWER") {
            return new Response('OK', { status: 200 });
         }

         const newPeriodStart = new Date(data.period_start);
         let rolledCredits = dbUser.credits ?? 0;

         // Skip adding credits for the initial free subscription.
         // The user.created webhook already allocated the free credits.
         if (!(planSlug === "free" && dbUser.currentPlan === "free")) {
            rolledCredits += PLAN_CREDITS[planSlug];
         }

         await db.user.update({
            where: { clerkUserId },
            data: {
               currentPlan: planSlug,
               credits: rolledCredits,
               creditsLastAllocatedAt: new Date(),        // actual allocation time
               lastProcessedPeriodStart: newPeriodStart,   // Clerk's billing period
            },
         });
      } catch (error) {
         console.error('Failed to handle subscriptionItem.active:', error);
         return new Response('Database error', { status: 500 });
      }
   }

   // Item updated — only allocate if this billing period hasn't been processed yet.
   // Exact match against lastProcessedPeriodStart correctly ignores non-renewal updates
   // (metadata, quantity, status changes) where period_start is unchanged from last time.
   if (evt.type === 'subscriptionItem.updated') {
      const data = evt.data as unknown as SubscriptionItemPayload;
      const clerkUserId = data.payer?.user_id;
      const planSlug = data.plan?.slug;

      if (!clerkUserId || !isKnownPlan(planSlug)) {
         return new Response('OK', { status: 200 });
      }

      try {
         const dbUser = await db.user.findUnique({ where: { clerkUserId } });

         if (!dbUser) {
            return new Response('User not found', { status: 404 });
         }

         if (dbUser.role === "INTERVIEWER") {
            return new Response('OK', { status: 200 });
         }

         const newPeriodStart = new Date(data.period_start);

         if (dbUser.lastProcessedPeriodStart?.getTime() === newPeriodStart.getTime()) {
            return new Response('OK — period already processed', { status: 200 });
         }

         const newCredits = PLAN_CREDITS[planSlug];
         const rolledCredits = newCredits + (dbUser.credits ?? 0);

         await db.user.update({
            where: { clerkUserId },
            data: {
               currentPlan: planSlug,
               credits: rolledCredits,
               creditsLastAllocatedAt: new Date(),
               lastProcessedPeriodStart: newPeriodStart,
            },
         });
      } catch (error) {
         console.error('Failed to handle subscriptionItem.updated:', error);
         return new Response('Database error', { status: 500 });
      }
   }

   return new Response('OK', { status: 200 });
}