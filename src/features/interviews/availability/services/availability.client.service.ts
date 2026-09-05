import { DASHBOARD_AVAILABILITY } from "@/config/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { BaseResponse } from "@/types/api.types";
import { AvailabilitySlot, DashboardAvailabilityResponse } from "../types/availability.types";
import { CreateAvailabilitySlotsSchemaTypes } from "../schemas/availability.schema";

// Get Availability Slots
export const getAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
   try {
      const res = await api.get(DASHBOARD_AVAILABILITY).json<DashboardAvailabilityResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to load availability slots"
      });
   }
};

// Create Availability Slots
export const createAvailabilitySlots = async (
   data: CreateAvailabilitySlotsSchemaTypes
): Promise<{ count: number; skipped: number; }> => {
   try {
      const res = await api
         .post(DASHBOARD_AVAILABILITY, { json: data })
         .json<BaseResponse<{ count: number; skipped: number; }>>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to add availability slots"
      });
   }
};

// Delete Availability Slot
export const deleteAvailabilitySlot = async (slotId: string): Promise<{ success: boolean; }> => {
   try {
      const res = await api
         .delete(`${DASHBOARD_AVAILABILITY}?id=${encodeURIComponent(slotId)}`)
         .json<BaseResponse<{ success: boolean; }>>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to delete slot"
      });
   }
};