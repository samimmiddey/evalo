import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';

type PLAN = "pro" | "starter" | "free";

const PLAN_CREDITS: Record<PLAN, number> = {
   pro: 15,
   starter: 5,
   free: 1,
};

export async function POST(req: Request) {
   const payload = await req.text();
   const headerPayload = await headers();

   const secret = process.env.CLERK_WEBHOOK_USER_SECRET;

   if (!secret) {
      throw new Error("Missing CLERK_WEBHOOK_USER_SECRET");
   };

   const wh = new Webhook(secret);

   let evt: WebhookEvent;
   try {
      evt = wh.verify(payload, {
         'svix-id': headerPayload.get('svix-id')!,
         'svix-timestamp': headerPayload.get('svix-timestamp')!,
         'svix-signature': headerPayload.get('svix-signature')!
      }) as WebhookEvent;
   } catch {
      return new Response('Invalid signature', { status: 400 });
   }

   if (evt.type === 'user.created') {
      const { id, first_name, last_name, image_url, email_addresses } = evt.data;

      try {
         await db.user.upsert({
            where: {
               clerkUserId: id
            },
            update: {},
            create: {
               clerkUserId: id,
               name: `${first_name} ${last_name}`,
               imageUrl: image_url,
               email: email_addresses[0].email_address,
               credits: PLAN_CREDITS.free,
               currentPlan: 'free',
               creditsLastAllocatedAt: new Date(),
            },
         });
      } catch (error) {
         console.error('Failed to handle user.created:', error);
         return new Response('Database error', { status: 500 });
      }
   }

   return new Response('OK', { status: 200 });
}


