"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import {
   CANCEL_SUBSCRIPTION,
   GET_BILLING,
   GET_BILLING_PAYMENTS,
   GET_BILLING_TRANSACTIONS
} from "@/constants/query-urls";
import {
   BillingClientResponse,
   BillingData,
   BillingPaginationParams,
   CancelSubscriptionClientResponse,
   CancelSubscriptionResponse,
   CandidatePaymentsClientResponse,
   CandidatePaymentsData,
   CandidateTransactionsClientResponse,
   CandidateTransactionsData
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

// Get Candidate Credit Transactions (Paginated)
export const getCandidateTransactions = async (
   params?: BillingPaginationParams
): Promise<CandidateTransactionsData> => {
   try {
      const { page, pageSize } = params ?? {};
      const searchParams = new URLSearchParams();

      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("pageSize", pageSize.toString());

      const url = searchParams.toString()
         ? `${GET_BILLING_TRANSACTIONS}?${searchParams.toString()}`
         : GET_BILLING_TRANSACTIONS;

      const res = await api.get(url).json<CandidateTransactionsClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load transactions history"
      });
   }
};

// Get Candidate Payments (Paginated)
export const getCandidatePayments = async (
   params?: BillingPaginationParams
): Promise<CandidatePaymentsData> => {
   try {
      const { page, pageSize } = params ?? {};
      const searchParams = new URLSearchParams();

      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("pageSize", pageSize.toString());

      const url = searchParams.toString()
         ? `${GET_BILLING_PAYMENTS}?${searchParams.toString()}`
         : GET_BILLING_PAYMENTS;

      const res = await api.get(url).json<CandidatePaymentsClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load payment history"
      });
   }
};

