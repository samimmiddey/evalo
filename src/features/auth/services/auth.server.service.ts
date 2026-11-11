import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { ValidationError } from "@/lib/app-error";
import { UserStatus } from "@/generated/prisma/enums";
import { CheckAccountStatusResponse } from "../types/auth.types";

export const checkUserAuthStatus = async (email: string): Promise<CheckAccountStatusResponse> => {
   try {
      const trimmedEmail = email?.trim().toLowerCase();

      if (!trimmedEmail) {
         throw new ValidationError("Email address is required");
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
         isBanned: user?.status === UserStatus.BANNED
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to verify account status"
      });
   }
};

