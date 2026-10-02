import { BookingStatus, CompletionReason, InterviewExpertise, StreamStatus } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export type InterviewStatus = BookingStatus;

export interface GetAppointmentsParams {
   page?: number;
   pageSize?: number;
   search?: string;
   status?: InterviewStatus;
}

export interface Interviewer {
   id: string;
   firstName: string | null;
   lastName: string | null;
   email: string;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: InterviewExpertise[] | null;
   creditRate: number | null;
   averageRating: number | null;
   totalRatings: number | null;
}

export interface Feedback {
   id: string;
   bookingId: string;
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
   createdAt: Date;
}

export interface Review {
   id: string;
   bookingId: string;
   rating: number;
   comment: string | null;
   createdAt: Date | string;
}

export interface Interview {
   id: string;
   startTime: string | Date;
   endTime: string | Date;
   status: InterviewStatus;
   completionReason: CompletionReason | null;
   streamCallId: string | null;
   streamStatus: StreamStatus;
   interviewer: Interviewer;
   feedback: Feedback | null;
   review: Review | null;
   recordingUrl: string | null;
   isRefunded: boolean;
}

export interface AppointmentsData {
   data: Interview[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type GetAppointmentsServerResponse = AppointmentsData;

export type GetAppointmentsClientResponse = BaseResponse<AppointmentsData>;

export interface AppointmentsFilterParams {
   search?: string;
   status?: InterviewStatus;
}

export interface AppointmentsStatsData {
   totalCount: number;
   completedCount: number;
   scheduledCount: number;
   cancelledCount: number;
   successRate: number;
}

export type AppointmentsStatsServerResponse = AppointmentsStatsData;

export type AppointmentsStatsClientResponse = BaseResponse<AppointmentsStatsData>;

export interface RetryBookSession {
   streamCallId: string | null;
   streamStatus: StreamStatus;
}

export type RetryBookSessionServerResponse = RetryBookSession;
export type RetryBookSessionClientResponse = BaseResponse<RetryBookSession>;

export interface CancelBookingData {
   success: true;
}

export interface ClaimRefundData {
   success: true;
}

export type CancelBookingClientResponse = BaseResponse<null>;

export interface ClaimRefundParams {
   bookingId: string;
}

export type ClaimRefundClientResponse = BaseResponse<null>;

export interface RateInterviewerData {
   success: true;
}

export type RateInterviewerClientResponse = BaseResponse<RateInterviewerData>;