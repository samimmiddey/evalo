import { BaseResponse } from "@/types/api.types";
import { BookingStatus, StreamStatus } from "@/generated/prisma/enums";

export interface DashboardStats {
   totalSessions: number;
   completedSessions: number;
   scheduledSessions: number;
   creditBalance: number;
   creditRate: number;
   averageRating: number | null;
   totalRatings: number;
}

export type DashboardStatsResponse = BaseResponse<DashboardStats>;

export interface DashboardNextSession {
   id: string;
   startTime: string;
   endTime: string;
   status: BookingStatus;
   streamCallId: string | null;
   streamStatus: StreamStatus;
   counterpart: {
      name: string;
      imageUrl: string | null;
      fallbackInitial: string;
      subtitle: string;
   };
}

export type DashboardNextSessionResponse = BaseResponse<DashboardNextSession | null>;