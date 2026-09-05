import { BaseResponse } from "@/types/api.types";
import { DashboardSession } from "../../shared/types/shared.types";
import { BookingStatus } from "@/generated/prisma/enums";

export interface SessionsFilterParams {
   status?: BookingStatus | 'ALL';
   search?: string;
   page?: number;
   pageSize?: number;
}

export interface SessionsData {
   data: DashboardSession[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type DashboardSessionsResponse = BaseResponse<SessionsData>;