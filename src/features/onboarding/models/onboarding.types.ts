import { Role } from "@/data/onboarding/onboardiong.types";
import { BaseResponse } from "@/models/api.model";

export interface Onboarding {
   role: Role | 'UNASSIGNED';
}

export type CompleteSetupResponse =
   | { success: true; role: Role | 'UNASSIGNED'; }
   | { success: false; message: string; };

export type OnboardingResponse = BaseResponse<Onboarding>;