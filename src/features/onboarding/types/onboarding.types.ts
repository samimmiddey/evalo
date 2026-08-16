import { UserRole } from "@/types/user.types";
import { BaseResponse } from "@/types/api.types";

export interface Onboarding {
   role: UserRole;
}

export type CompleteSetupResponse = UserRole;

export type OnboardingResponse = BaseResponse<Onboarding>;