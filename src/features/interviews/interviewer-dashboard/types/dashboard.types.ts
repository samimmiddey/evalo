import { PayoutStatus, TransactionType } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export type DashboardTabType = 'sessions' | 'availability' | 'payouts' | 'settings';

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

export type DashboardPayoutsResponse = BaseResponse<DashboardPayoutsData>;
export type DashboardProfileResponse = BaseResponse<InterviewerProfileData>;
