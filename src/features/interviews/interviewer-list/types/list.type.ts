import { BaseResponse } from "@/types/api.types";
import { Interviewer } from "../../shared/types/interviewers.shared.types";

export interface FilterParams {
   search?: string;
   expertise?: string[];
   experience?: string[];
}

export interface GetInterviewersParams {
   page?: number;
   pageSize?: number;
   search?: string;
   expertise?: string[];
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