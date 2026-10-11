import { PRO, STARTER } from "@/constants/cashfree";
import { apiCashfree } from "@/lib/api-cashfree";
import { UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { CashfreeError, Plan, PlansResponse } from "@/types/cashfree.types";
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

// Fetch Subscription Plans
export const fetchPlans = async (): Promise<PlansResponse> => {
   const user = await currentUser();

   // Check user authentication
   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   // Get plans
   try {
      const [starter, pro] = await Promise.all([
         apiCashfree.get(`/plans/${STARTER}`).json<Plan | CashfreeError>(),
         apiCashfree.get(`/plans/${PRO}`).json<Plan | CashfreeError>()
      ]);

      if ('code' in starter) {
         throw new ValidationError(starter.message);
      }

      if ('code' in pro) {
         throw new ValidationError(pro.message);
      }

      return {
         plans: [starter, pro]
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch subscription plans"
      });
   }
};