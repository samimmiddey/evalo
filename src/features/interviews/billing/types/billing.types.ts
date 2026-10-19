import { SubscriptionStatus, TransactionType } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export interface BillingPlanInfo {
   planSlug: string;
   planName: string;
   status: SubscriptionStatus | "FREE";
   cashfreeSubId?: string | null;
   recurringAmount?: number | null;
   currentPeriodStart?: string | null;
   currentPeriodEnd?: string | null;
   customerPhone?: string | null;
}

export interface CandidateCreditInfo {
   credits: number;
   creditsLastAllocatedAt?: string | null;
   lastProcessedPeriodStart?: string | null;
}

export interface CandidateCreditTransaction {
   id: string;
   amount: number;
   type: TransactionType;
   reason?: string | null;
   bookingId?: string | null;
   interviewerName?: string | null;
   createdAt: string;
}

export interface CashfreePaymentRecord {
   cfPaymentId: string;
   paymentId: string;
   paymentStatus: "SUCCESS" | "FAILED" | "PENDING" | "CANCELLED";
   paymentAmount: number;
   paymentCurrency: string;
   paymentTime: string;
   paymentMethod?: string | null;
}

export interface BillingData {
   plan: BillingPlanInfo;
   credit: CandidateCreditInfo;
   transactions: CandidateCreditTransaction[];
   payments: CashfreePaymentRecord[];
}

export type BillingClientResponse = BaseResponse<BillingData>;

export interface CancelSubscriptionResponse {
   success: boolean;
   message: string;
}

export type CancelSubscriptionClientResponse = BaseResponse<CancelSubscriptionResponse>;
