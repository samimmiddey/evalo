"use client";

import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import {
   GET_DASHBOARD_PAYOUTS,
   GET_DASHBOARD_SESSIONS,
   REQUEST_DASHBOARD_PAYOUT,
   UPDATE_DASHBOARD_PROFILE
} from "@/config/query-urls";
import {
   DashboardPayoutsData,
   DashboardPayoutsResponse,
   DashboardProfileResponse,
   DashboardSessionsData,
   DashboardSessionsResponse,
   InterviewerProfileData,
   SessionsFilterParams
} from "../types/dashboard.types";
import {
   RequestPayoutSchemaTypes,
   UpdateInterviewerProfileSchemaTypes
} from "../schemas/dashboard.schemas";
import { BaseResponse } from "@/types/api.types";

// Get Dashboard Sessions
export const getDashboardSessions = async (
   params?: SessionsFilterParams
): Promise<DashboardSessionsData> => {
   try {
      const searchParams = new URLSearchParams();

      if (params?.page) {
         searchParams.set("page", params.page.toString());
      }
      if (params?.pageSize) {
         searchParams.set("pageSize", params.pageSize.toString());
      }
      if (params?.status && params.status !== "ALL") {
         searchParams.set("status", params.status);
      }
      if (params?.search?.trim()) {
         searchParams.set("search", params.search.trim());
      }

      const queryString = searchParams.toString();
      const url = queryString ? `${GET_DASHBOARD_SESSIONS}?${queryString}` : GET_DASHBOARD_SESSIONS;

      const res = await api.get(url).json<DashboardSessionsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load interview sessions"
      });
   }
};

// Get Payouts & Transactions
export const getPayoutsData = async (): Promise<DashboardPayoutsData> => {
   try {
      const res = await api.get(GET_DASHBOARD_PAYOUTS).json<DashboardPayoutsResponse>();

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
         .post(REQUEST_DASHBOARD_PAYOUT, { json: data })
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

// Update Profile & Rates
export const updateInterviewerProfile = async (
   data: UpdateInterviewerProfileSchemaTypes
): Promise<InterviewerProfileData> => {
   try {
      const res = await api
         .patch(UPDATE_DASHBOARD_PROFILE, { json: data })
         .json<DashboardProfileResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to update profile settings"
      });
   }
};
