import { apiError } from "@/lib/api-error";
import { DashboardNextSession, DashboardNextSessionResponse, DashboardStats, DashboardStatsResponse } from "../types/dashboard.types";
import { api } from "@/lib/api";
import { GET_DASHBOARD_NEXT_SESSION, GET_DASHBOARD_STATS } from "@/constants/query-urls";

// Get Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
   try {
      const res = await api.get(GET_DASHBOARD_STATS).json<DashboardStatsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load dashboard statistics"
      });
   }
};

// Get Next Active / Upcoming Session
export const getNextSession = async (): Promise<DashboardNextSession | null> => {
   try {
      const res = await api.get(GET_DASHBOARD_NEXT_SESSION).json<DashboardNextSessionResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load next session"
      });
   }
};