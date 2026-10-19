"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import {
   CANCEL_SUBSCRIPTION,
   GET_BILLING
} from "@/constants/query-urls";
import {
   BillingClientResponse,
   BillingData,
   CancelSubscriptionClientResponse,
   CancelSubscriptionResponse
} from "../types/billing.types";

// Get Candidate Billing Data
export const getBillingData = async (): Promise<BillingData> => {
   try {
      const res = await api.get(GET_BILLING).json<BillingClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load billing and subscription details"
      });
   }
};

// Cancel Subscription
export const cancelSubscription = async (): Promise<CancelSubscriptionResponse> => {
   try {
      const res = await api.post(CANCEL_SUBSCRIPTION).json<CancelSubscriptionClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to cancel subscription"
      });
   }
};
