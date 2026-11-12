import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { ValidationError } from "@/lib/app-error";
import { UserStatus } from "@/generated/prisma/enums";
import { CheckAccountStatusResponse } from "../types/auth.types";
import { clerkClient } from "@clerk/nextjs/server";

export const checkUserAuthStatus = async (email: string): Promise<CheckAccountStatusResponse> => {
   try {
      const trimmedEmail = email?.trim().toLowerCase();

      if (!trimmedEmail) {
         throw new ValidationError("Email address is required");
      }

      // Check if user exists in Clerk with role = 'ADMIN'
      const clerk = await clerkClient();
      const { data: clerkUsers } = await clerk.users.getUserList({
         emailAddress: [trimmedEmail],
      });

      const clerkUser = clerkUsers[0];
      const role =
         (clerkUser?.publicMetadata as { role?: string } | undefined)?.role ??
         (clerkUser?.privateMetadata as { role?: string } | undefined)?.role;

      if (role === "ADMIN") {
         return {
            isBanned: false,
            isAdmin: true,
         };
      }

      const user = await db.user.findFirst({
         where: {
            email: {
               equals: trimmedEmail,
               mode: "insensitive"
            }
         },
         select: {
            status: true
         }
      });

      return {
         isBanned: user?.status === UserStatus.BANNED,
         isAdmin: false,
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to verify account status"
      });
   }
};

