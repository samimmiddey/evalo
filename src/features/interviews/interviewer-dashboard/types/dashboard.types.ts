import { AvailabilityStatus, BookingStatus, FeedbackRating, PayoutStatus, StreamStatus, TransactionType } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export type DashboardTabType = 'sessions' | 'availability' | 'payouts' | 'settings';

export interface DashboardStats {
   totalSessions: number;
   completedSessions: number;
   scheduledSessions: number;
   cancelledSessions: number;
   totalEarnings: number;
   creditBalance: number;
   creditRate: number;
   averageRating: number | null;
   totalRatings: number;
   nextSession: DashboardSession | null;
}

export interface CandidateInfo {
   id: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   email: string;
}

export interface SessionFeedback {
   id: string;
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: FeedbackRating;
   sessionRating: number | null;
   sessionComment: string | null;
   createdAt: string;
}

export interface DashboardSession {
   id: string;
   startTime: string;
   endTime: string;
   status: BookingStatus;
   streamStatus: StreamStatus;
   creditsCharged: number;
   streamCallId: string | null;
   recordingUrl: string | null;
   candidate: CandidateInfo;
   feedback: SessionFeedback | null;
   createdAt: string;
}

export interface SessionsFilterParams {
   status?: BookingStatus | 'ALL';
   search?: string;
   page?: number;
   pageSize?: number;
}

export interface DashboardSessionsData {
   data: DashboardSession[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface AvailabilitySlot {
   id: string;
   startTime: string;
   endTime: string;
   status: AvailabilityStatus;
}

export interface AvailabilityDateGroup {
   date: string;
   displayDate: string;
   dayName: string;
   slots: AvailabilitySlot[];
}

export interface PayoutRecord {
   id: string;
   credits: number;
   platformFee: number;
   netAmount: number;
   paymentMethod: string;
   paymentDetail: string;
   status: PayoutStatus;
   adminNote: string | null;
   createdAt: string;
   processedAt: string | null;
}

export interface CreditTransactionRecord {
   id: string;
   amount: number;
   type: TransactionType;
   bookingId: string | null;
   createdAt: string;
}

export interface DashboardPayoutsData {
   creditBalance: number;
   ratePerCredit: number;
   platformFeePercent: number;
   payouts: PayoutRecord[];
   transactions: CreditTransactionRecord[];
}

export interface InterviewerProfileData {
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: string[];
   bio: string | null;
}

export type DashboardStatsResponse = BaseResponse<DashboardStats>;
export type DashboardSessionsResponse = BaseResponse<DashboardSessionsData>;
export type DashboardAvailabilityResponse = BaseResponse<AvailabilitySlot[]>;
export type DashboardPayoutsResponse = BaseResponse<DashboardPayoutsData>;
export type DashboardProfileResponse = BaseResponse<InterviewerProfileData>;
