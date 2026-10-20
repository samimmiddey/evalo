import { PayoutStatus, TransactionType } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export interface PayoutRecord {
   id: string;
   credits: number;
   platformFee: number;
   netAmount: number;
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

export interface PayoutPaginationParams {
   page?: number;
   pageSize?: number;
}

export interface PaginatedPayoutRecordsData {
   data: PayoutRecord[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface PaginatedCreditTransactionsData {
   data: CreditTransactionRecord[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export interface PayoutsData {
   creditBalance: number;
}

export type PayoutsResponse = BaseResponse<PayoutsData>;
export type PayoutRecordsResponse = BaseResponse<PaginatedPayoutRecordsData>;
export type CreditTransactionsResponse = BaseResponse<PaginatedCreditTransactionsData>;
