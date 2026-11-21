import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { PLAN_CREDITS, UserServer } from "@/types/user.types";
import { currentUser } from "@clerk/nextjs/server";
import { SubscriptionStatus, TransactionType } from "@/generated/prisma/enums";
import { THIRTY_DAYS_MS } from "@/constants/interviews";

// Check user and allocate credits if needed
export const checkUser = async (): Promise<UserServer | null> => {
   const user = await currentUser();

   if (!user) {
      return null;
   };

   try {
      const loggedInUser = await db.user.findUnique({
         where: {
            clerkUserId: user.id,
         },
         include: {
            subscriptions: {
               orderBy: { createdAt: 'desc' },
               take: 1,
               select: {
                  status: true
               }
            }
         }
      });

      if (!loggedInUser) return null;

      const latestSub = loggedInUser.subscriptions?.[0] ?? null;

      // Lazy replenishment: Grant 1 credit every 30 days for candidates on the free plan
      const isCandidate = loggedInUser.role === 'CANDIDATE';
      const isFreePlan = loggedInUser.currentPlan === 'free';
      const hasNoActiveSub = latestSub?.status !== SubscriptionStatus.ACTIVE;

      if (isCandidate && isFreePlan && hasNoActiveSub) {
         const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS);
         const lastAllocated = loggedInUser.creditsLastAllocatedAt ?? loggedInUser.createdAt;

         if (lastAllocated <= cutoffDate) {
            const now = new Date();
            const updated = await db.$transaction(async (tx) => {
               const result = await tx.user.updateMany({
                  where: {
                     id: loggedInUser.id,
                     currentPlan: 'free',
                     role: 'CANDIDATE',
                     OR: [
                        { creditsLastAllocatedAt: { lte: cutoffDate } },
                        {
                           creditsLastAllocatedAt: null,
                           createdAt: { lte: cutoffDate }
                        }
                     ]
                  },
                  data: {
                     credits: { increment: PLAN_CREDITS.free },
                     creditsLastAllocatedAt: now
                  }
               });

               if (result.count > 0) {
                  await tx.creditTransaction.create({
                     data: {
                        userId: loggedInUser.id,
                        amount: PLAN_CREDITS.free,
                        type: TransactionType.CREDIT_PURCHASE
                     }
                  });
                  return true;
               }

               return false;
            });

            if (updated) {
               loggedInUser.credits += PLAN_CREDITS.free;
               loggedInUser.creditsLastAllocatedAt = now;
            }
         }
      }

      return {
         ...loggedInUser,
         subscriptionStatus: latestSub?.status ?? null
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch user'
      });
   };
};