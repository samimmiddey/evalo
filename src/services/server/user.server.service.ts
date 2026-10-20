import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { UserServer } from "@/types/user.types";
import { currentUser } from "@clerk/nextjs/server";

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