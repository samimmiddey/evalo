"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import {
   GET_PAYOUTS,
   REQUEST_PAYOUT
} from "@/constants/query-urls";
import {
   PayoutsData,
   PayoutsResponse
} from "../types/payout.types";
import {
   RequestPayoutSchemaTypes
} from "../schemas/payout.schemas";
import { BaseResponse } from "@/types/api.types";

// Get Payouts & Transactions
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
