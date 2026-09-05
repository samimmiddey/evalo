import { BaseResponse } from "@/types/api.types";

export interface InterviewerProfileData {
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: string[];
   bio: string | null;
}

export type ProfileResponse = BaseResponse<InterviewerProfileData>;