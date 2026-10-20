import { UserRole } from "@/types/user.types";

export { };

declare global {
   interface CustomJwtSessionClaims {
      metadata: {
         onboardingComplete?: boolean;
         role?: UserRole;
      };
   }
}

export interface CashfreeSubscriptionOptions {
   subsSessionId: string;
   redirectTarget?: "_self" | "_modal" | "_top" | "_blank";
}

export interface CashfreeInstance {
   subscriptionsCheckout: (options: CashfreeSubscriptionOptions) => Promise<{ error?: { message: string; code?: string } } | void>;
}

export type CashfreeConstructor = (options: {
   mode: "sandbox" | "production";
}) => CashfreeInstance;

declare global {
   interface Window {
      Cashfree: CashfreeConstructor;
   }
}