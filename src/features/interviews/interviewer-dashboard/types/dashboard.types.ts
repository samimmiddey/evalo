import { AvailabilityStatus, BookingStatus, PayoutStatus, TransactionType } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";
import { DashboardSession } from "../../shared/types/shared.types";

export type DashboardTabType = 'sessions' | 'availability' | 'payouts' | 'settings';

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

export type DashboardSessionsResponse = BaseResponse<DashboardSessionsData>;
export type DashboardAvailabilityResponse = BaseResponse<AvailabilitySlot[]>;
export type DashboardPayoutsResponse = BaseResponse<DashboardPayoutsData>;
export type DashboardProfileResponse = BaseResponse<InterviewerProfileData>;
