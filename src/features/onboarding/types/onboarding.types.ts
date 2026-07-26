import { UserRole } from "@/types/user.types";
import { BaseResponse } from "@/types/api.types";

export interface Onboarding {
   role: UserRole;
}

export type CompleteSetupResponse =
   | { success: true; role: UserRole; }
   | { success: false; message: string; };

export type OnboardingResponse = BaseResponse<Onboarding>;