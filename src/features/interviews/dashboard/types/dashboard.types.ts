import { BaseResponse } from "@/types/api.types";
import { DashboardSession } from "../../shared/types/shared.types";

export interface DashboardStats {
   totalSessions: number;
   completedSessions: number;
   scheduledSessions: number;
   cancelledSessions: number;
   totalEarnings: number;
   creditBalance: number;
   creditRate: number;
   averageRating: number | null;
   totalRatings: number;
   nextSession: DashboardSession | null;
}

export type DashboardStatsResponse = BaseResponse<DashboardStats>;