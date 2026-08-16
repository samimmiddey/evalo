"use client";

import { apiError } from "@/lib/api-error";
import { AppointmentsData, GetAppointmentsClientResponse, GetAppointmentsParams, AppointmentsStatsClientResponse, AppointmentsStatsData, CancelBookingClientResponse, RetryBookSessionClientResponse, RetryBookSession, CancelBookingData } from "../types/appointments.types";
import { api } from "@/lib/api";
import { CANCEL_BOOKING, GET_APPOINTMENT_STATS, GET_APPOINTMENTS, RETRY_BOOKING } from "@/config/query-urls";

// Get appointments
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
      return apiError({
         error,
         fallbackMessage: "Failed to get appointments"
      });
   }
};

// Get appointments stats
export const getAppointmentsStats = async (): Promise<AppointmentsStatsData> => {
   try {

      const res = await api.get(GET_APPOINTMENT_STATS).json<AppointmentsStatsClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;

   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to get appointment stats"
      });
   }
};

// Cancel booking
export const cancelBooking = async (bookingId: string): Promise<CancelBookingData> => {
   try {
      if (!bookingId) {
         throw new Error("Booking ID is required");
      }

      const res = await api.post(CANCEL_BOOKING, { json: { bookingId } }).json<CancelBookingClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return {
         success: true
      };
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to cancel booking"
      });
   }
};

// Retry booking
export const retryStreamCall = async (bookingId: string): Promise<RetryBookSession> => {
   try {
      if (!bookingId) {
         throw new Error("Booking ID is required");
      }

      const res = await api.post(RETRY_BOOKING, { json: { bookingId } }).json<RetryBookSessionClientResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "We couldn't prepare the meeting room. Please try again."
      });
   }
};