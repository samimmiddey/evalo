import { z } from 'zod';

// Create availability slots schema
export const createAvailabilitySlotsSchema = z.object({
   slots: z
      .array(
         z.object({
            startTime: z.string().min(1, "Start time is required"),
            endTime: z.string().min(1, "End time is required")
         })
      )
      .min(1, "At least one slot is required")
});

export type CreateAvailabilitySlotsSchemaTypes = z.infer<typeof createAvailabilitySlotsSchema>;

// Delete availability slot schema
export const deleteAvailabilitySlotSchema = z.object({
   id: z.string().min(1, "Slot ID is required")
});

export type DeleteAvailabilitySlotSchemaTypes = z.infer<typeof deleteAvailabilitySlotSchema>;