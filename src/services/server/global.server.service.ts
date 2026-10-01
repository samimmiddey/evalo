import { UnauthorizedError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { Config } from "@/types/global.types";
import { currentUser } from "@clerk/nextjs/server";

// Get Platform Config Data
export const getPlatformConfig = async (): Promise<Config | null> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   try {
      const config = await db.platformConfig.findFirst({
         orderBy: { createdAt: "desc" }
      });

      return config;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch platform configuration"
      });
   }
};