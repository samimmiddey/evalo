import { UserRole } from "@/models/user.model";
import { BaseResponse } from "@/models/api.model";

export interface Onboarding {
   role: UserRole;
}

export type CompleteSetupResponse =
   | { success: true; role: UserRole; }
   | { success: false; message: string; };

export type OnboardingResponse = BaseResponse<Onboarding>;