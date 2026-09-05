import { apiError } from "@/lib/api-error";
import { DashboardStats, DashboardStatsResponse } from "../types/dashboard.types";
import { api } from "@/lib/api";
import { GET_DASHBOARD_STATS } from "@/config/query-urls";

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