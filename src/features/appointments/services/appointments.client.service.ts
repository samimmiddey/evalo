"use client";

import { apiError } from "@/lib/api-error";
import { AppointmentsData, GetAppointmentsClientResponse, GetAppointmentsParams } from "../types/appointments.types";
import { api } from "@/lib/api";
import { GET_APPOINTMENTS } from "@/config/query-urls";

export const getAppointments = async (params: GetAppointmentsParams): Promise<AppointmentsData> => {
   try {
      const { page, pageSize, search, status } = params;

      const searchParams = new URLSearchParams();

      if (page) searchParams.set('page', page.toString());
      if (pageSize) searchParams.set('pageSize', pageSize.toString());
      if (search) searchParams.set('search', search.toString());
      if (status) searchParams.set('status', status.toString());

      const res = await api.get(`${GET_APPOINTMENTS}?${searchParams.toString()}`).json<GetAppointmentsClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;

   } catch (error: unknown) {
      return apiError(error, "Failed to get appointments");
   }
};