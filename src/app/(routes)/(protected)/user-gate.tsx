import { checkUser } from '@/services/server/user.service';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import React from 'react';

const UserGate = async ({ children }: { children: React.ReactNode; }) => {
   let user = await checkUser();

   if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) redirect('/sign-in');

      // Get the user from DB
      user = await checkUser();

      // Still missing — reconcile ourselves
      if (!user) {
         try {
            user = await db.user.upsert({
               where: { clerkUserId: clerkUser.id },
               update: {},
               create: {
                  clerkUserId: clerkUser.id,
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

   return <>{children}</>;
};

export default UserGate;