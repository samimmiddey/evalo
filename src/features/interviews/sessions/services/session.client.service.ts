import { GET_DASHBOARD_SESSIONS } from "@/config/query-urls";
import { SessionsData, DashboardSessionsResponse, SessionsFilterParams } from "../types/session.types";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";

// Get Dashboard Sessions
export const getDashboardSessions = async (
   params?: SessionsFilterParams
): Promise<SessionsData> => {
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