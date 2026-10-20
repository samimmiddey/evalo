"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import {
   GET_PAYOUTS,
   GET_PAYOUT_RECORDS,
   GET_PAYOUT_TRANSACTIONS,
   REQUEST_PAYOUT
} from "@/constants/query-urls";
import {
   CreditTransactionsResponse,
   PaginatedCreditTransactionsData,
   PaginatedPayoutRecordsData,
   PayoutPaginationParams,
   PayoutRecordsResponse,
   PayoutsData,
   PayoutsResponse
} from "../types/payout.types";
import {
   RequestPayoutSchemaTypes
} from "../schemas/payout.schemas";
import { BaseResponse } from "@/types/api.types";

// Get Payouts Overview (Credit Balance)
export const getPayoutsData = async (): Promise<PayoutsData> => {
   try {
      const res = await api.get(GET_PAYOUTS).json<PayoutsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load payouts data"
      });
   }
};

// Get Payout Records (Paginated)
export const getPayoutRecords = async (
   params?: PayoutPaginationParams
): Promise<PaginatedPayoutRecordsData> => {
   try {
      const { page, pageSize } = params ?? {};
      const searchParams = new URLSearchParams();

      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("pageSize", pageSize.toString());

      const url = searchParams.toString()
         ? `${GET_PAYOUT_RECORDS}?${searchParams.toString()}`
         : GET_PAYOUT_RECORDS;

      const res = await api.get(url).json<PayoutRecordsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load payout records"
      });
   }
};

// Get Credit Transactions (Paginated)
export const getCreditTransactions = async (
   params?: PayoutPaginationParams
): Promise<PaginatedCreditTransactionsData> => {
   try {
      const { page, pageSize } = params ?? {};
      const searchParams = new URLSearchParams();

      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("pageSize", pageSize.toString());

      const url = searchParams.toString()
         ? `${GET_PAYOUT_TRANSACTIONS}?${searchParams.toString()}`
         : GET_PAYOUT_TRANSACTIONS;

      const res = await api.get(url).json<CreditTransactionsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load credit transactions"
      });
   }
};

// Request Payout
export const requestPayout = async (
   data: RequestPayoutSchemaTypes
): Promise<{ success: boolean; payoutId: string; }> => {
   try {
      const res = await api
         .post(REQUEST_PAYOUT, { json: data })
         .json<BaseResponse<{ success: boolean; payoutId: string; }>>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to submit payout request"
      });
   }
};
