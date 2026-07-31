import { BaseResponse } from "@/types/api.types";

export interface Availability {
   startTime: Date | string;
   endTime: Date | string;
}

export interface Interviewer {
   id: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   expertise: string[];
   experience: number | null;
   bio: string | null;
   creditRate: number;
   availabilities: Availability[];
   averageRating: number | null;
   totalRatings: number;
}

export type InterviewersResponse = BaseResponse<Interviewer[]>;