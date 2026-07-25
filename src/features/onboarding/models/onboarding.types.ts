import { BaseResponse } from "@/models/api.model";

export interface Onboarding {
   success: true;
}

export type OnboardingResponse = BaseResponse<Onboarding>;