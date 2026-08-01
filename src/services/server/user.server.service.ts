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
         }
      });

      if (!loggedInUser) return null;

      return loggedInUser;
   } catch (error: unknown) {
      return serverError(error, 'Failed to fetch user');
   };
};