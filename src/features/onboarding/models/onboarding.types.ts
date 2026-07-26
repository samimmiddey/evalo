import { BaseResponse } from "@/models/api.model";

export interface Onboarding {
   success: true;
}

export type CompleteSetupResponse =
   | { success: true; }
   | { success: false; message: string; };

export type OnboardingResponse = BaseResponse<Onboarding>;