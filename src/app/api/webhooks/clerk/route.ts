import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { db } from '@/lib/prisma';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { PLAN_CREDITS } from '@/types/user.types';

export async function POST(req: Request) {
   const payload = await req.text();
   const headerPayload = await headers();

   const secret = process.env.CLERK_WEBHOOK_USER_SECRET;
   if (!secret) {
      throw new Error('Missing CLERK_WEBHOOK_USER_SECRET');
   }

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

   // Unified handler for user.created and user.updated
   if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, image_url, email_addresses, primary_email_address_id, first_name, last_name } = evt.data;

      if (!id) return new Response('Missing user ID', { status: 400 });

      const email =
         email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address ??
         email_addresses?.[0]?.email_address;

      if (!email) return new Response('Missing email address', { status: 400 });

      try {
         await db.user.upsert({
            where: { clerkUserId: id },
            update: evt.type === 'user.created' ? {} : {
               email,
               imageUrl: image_url,
               firstName: first_name ?? null,
               lastName: last_name ?? null,
            },
            create: {
               clerkUserId: id,
               email,
               imageUrl: image_url,
               firstName: first_name ?? null,
               lastName: last_name ?? null,
               credits: PLAN_CREDITS.free,
               currentPlan: 'free',
               creditsLastAllocatedAt: new Date(),
            },
         });
      } catch (error) {
         // eslint-disable-next-line no-console
         console.error(`Failed to handle ${evt.type}:`, error);
         return new Response('Database error', { status: 500 });
      }
   }

   return new Response('OK', { status: 200 });
}