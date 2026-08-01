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

export interface FilterParams {
   search?: string;
   expertise?: string;
   experience?: string[];
}

export interface GetInterviewersParams {
   page?: number;
   pageSize?: number;
   search?: string;
   expertise?: string;
   experience?: string[];
}

export interface GetInterviewersResponse {
   data: Interviewer[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type InterviewersResponse = BaseResponse<GetInterviewersResponse>;