import { BaseResponse } from "@/types/api.types";
import { Interviewer } from "../../shared/types/shared.types";

export interface Booking {
   startTime: Date | string;
   endTime: Date | string;
}

export interface InterviewerDetails extends Interviewer {
   bookingsAsInterviewer: Booking[];
   currentPlan: string;
}

export interface CandidateDetails {
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   createdAt: Date;
}

export interface ReviewDetails {
   rating: number;
   comment: string | null;
   createdAt?: Date | string;
}

export interface FeedbackData {
   id: string;
   candidate: CandidateDetails;
   review: ReviewDetails | null;
}

export interface InterviewerFeedback {
   totalCount: number;
   data: FeedbackData[];
   page: number;
   pageSize: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface GetFeedbackParams {
   id: string;
   page?: number;
   pageSize?: number;
}

export type InterviewerFeedbackResponse = BaseResponse<InterviewerFeedback>;

export interface BookSessionParams {
   interviewerId: string;
   startTime: string;
   endTime: string;
}

export interface BookSession {
   booking: string;
   streamCallId: string;
   streamStatus: string;
}

export type BookSessionSetupResponse = BookSession;

export type BookSessionResponse = BaseResponse<BookSession>;