import { z } from "zod";

const domainValues = [
   "FRONTEND",
   "BACKEND",
   "FULLSTACK",
   "DEVOPS",
   "DSA",
   "SYSTEM_DESIGN",
   "MOBILE",
   "ML_AI",
   "SECURITY",
   "QA",
   "CLOUD"
] as const;

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

// Request payout schema
export const requestPayoutSchema = z.object({
   credits: z.number().int().min(1, "Must withdraw at least 1 credit"),
   paymentMethod: z.string().min(1, "Payment method is required"),
   paymentDetail: z.string().min(3, "Payment details must be at least 3 characters").max(200, "Details too long")
});

export type RequestPayoutSchemaTypes = z.infer<typeof requestPayoutSchema>;

// Update interviewer profile schema
export const updateInterviewerProfileSchema = z.object({
   designation: z.string().min(1, "Designation is required").max(100),
   company: z.string().min(1, "Company is required").max(100),
   experience: z.number().int().min(0, "Experience cannot be negative").max(50),
   expertise: z.array(z.enum(domainValues)).min(1, "Select at least one area of expertise"),
   bio: z.string().min(10, "Bio must be at least 10 characters").max(600, "Bio must be at most 600 characters")
});

export type UpdateInterviewerProfileSchemaTypes = z.infer<typeof updateInterviewerProfileSchema>;
