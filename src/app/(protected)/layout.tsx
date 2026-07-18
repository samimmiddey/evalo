import React from 'react'
import { checkUser } from '@/services/user.service';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { customDelay } from '@/utils/custom-delay';
import { db } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';

const ProtectedLayout = async ({ children }: { children: React.ReactElement }) => {
   let user = await checkUser();

   if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) redirect('/sign-in');

      // Give the webhook a chance to land
      await customDelay(2000);
      user = await checkUser();

      // Still missing — reconcile ourselves
      if (!user) {
         try {
            user = await db.user.upsert({
               where: { clerkUserId: clerkUser.id },
               update: {},
               create: {
                  clerkUserId: clerkUser.id,
                  name: `${clerkUser.firstName} ${clerkUser.lastName}`,
                  imageUrl: clerkUser.imageUrl,
                  email: clerkUser.emailAddresses[0].emailAddress,
                  credits: 1,
                  currentPlan: "free",
                  creditsLastAllocatedAt: new Date(),
               },
            });
         } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
               // Another concurrent request (or the webhook) created it first — just fetch it
               user = await checkUser();
            } else {
               throw error;
            }
         }
      }
   };

   return (
      <>
         {children}
      </>
   )
}

export default ProtectedLayout