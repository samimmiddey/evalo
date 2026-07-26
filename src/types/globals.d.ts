import { UserRole } from "@/models/user.model";

export { };

declare global {
   interface CustomJwtSessionClaims {
      metadata: {
         onboardingComplete?: boolean;
         role?: UserRole;
      };
   }
}