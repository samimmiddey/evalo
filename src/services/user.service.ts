"use server";

import { User } from "@/generated/prisma/client";
import { db } from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";

type Plan = "pro" | "starter" | "free";

const PLAN_CREDITS: Record<Plan, number> = {
   pro: 15,
   starter: 5,
   free: 1,
};

const getCurrentPlan = async (): Promise<Plan> => {
   const { has } = await auth();

   if (has({ plan: 'pro' })) return 'pro';
   if (has({ plan: 'starter' })) return 'starter';
   return 'free';
};

const shouldAllocateCredits = (user: User, currentPlan: Plan): boolean => {
   // Always allocate if plan changed
   if (user.currentPlan !== currentPlan) return true;

   // Allocate if
   if (!user.creditsLastAllocatedAt) return true;

   // Allocate if it's a new calender month since last allocation
   const now = new Date();
   const last = new Date(user.creditsLastAllocatedAt);

   const isNewMonth = now.getFullYear() > last.getFullYear() || now.getMonth() > last.getMonth();

   return isNewMonth;
}

// Check user and allocate credits if needed
export const checkUser = async () => {
   const user = await currentUser();

   if (!user) {
      return null;
   };

   try {
      const currentPlan = await getCurrentPlan();
      const credits = PLAN_CREDITS[currentPlan];

      const loggedInUser = await db.user.findUnique({
         where: {
            clerkUserId: user.id,
         }
      });

      if (!loggedInUser) return null;

      if (loggedInUser.role === "INTERVIEWER") return loggedInUser;

      if (shouldAllocateCredits(loggedInUser, currentPlan)) {
         const rolledCredits = credits + (loggedInUser.credits ?? 0);

         return await db.user.update({
            where: { clerkUserId: user.id },
            data: {
               credits: rolledCredits,
               currentPlan,
               creditsLastAllocatedAt: new Date(),
            },
         });
      };

      return loggedInUser;
   } catch (error: unknown) {
      if (error instanceof Error) {
         throw new Error(error.message);
      }

      throw new Error("Failed to check user");
   };
};