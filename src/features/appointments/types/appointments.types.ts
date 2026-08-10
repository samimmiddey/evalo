import { InterviewExpertise, StreamStatus } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface GetAppointmentsParams {
   page?: number;
   pageSize?: number;
   search?: string;
   status?: InterviewStatus;
}

export interface Interviewer {
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
   sessionRating: number | null;
   sessionComment: string | null;
   createdAt: Date;
};

export interface Interview {
   id: string;
   startTime: string | Date;
   endTime: string | Date;
   status: InterviewStatus;
   streamCallId: string | null;
   streamStatus: StreamStatus;
   interviewer: Interviewer;
   feedback: Feedback | null;
}

export interface AppointmentsData {
   success: true,
   data: Interview[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type GetAppointmentsServerResponse =
   | { success: false, message: string; }
   | AppointmentsData;

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

export interface AppointmentsStats {
   success: true;
   data: AppointmentsStatsData;
}

export type AppointmentsStatsServerResponse =
   | { success: false, message: string; }
   | AppointmentsStats;

export type AppointmentsStatsClientResponse = BaseResponse<AppointmentsStatsData>;

export interface RetryBookSession {
   success: true;
   streamCallId: string | null;
   streamStatus: StreamStatus;
}

export type RetryBookSessionServerResponse =
   | RetryBookSession
   | { success: false; message: string; };

export interface CancelBookingServerResponse {
   success: boolean;
   message: string;
}