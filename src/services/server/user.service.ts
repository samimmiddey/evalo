"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Check user and allocate credits if needed
export const checkUser = async () => {
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
      if (error instanceof Error) {
         throw error;
      }

      throw new Error("Failed to check user");
   };
};