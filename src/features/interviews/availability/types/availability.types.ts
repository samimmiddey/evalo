import { AvailabilityStatus } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export interface AvailabilitySlot {
   id: string;
   startTime: string;
   endTime: string;
   status: AvailabilityStatus;
}

export interface AvailabilityDateGroup {
   date: string;
   displayDate: string;
   dayName: string;
   slots: AvailabilitySlot[];
}

export type DashboardAvailabilityResponse = BaseResponse<AvailabilitySlot[]>;