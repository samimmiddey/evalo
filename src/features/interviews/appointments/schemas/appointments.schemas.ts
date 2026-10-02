import { z } from "zod";

export const rateInterviewerSchema = z.object({
   bookingId: z.string().min(1, "Booking ID is required"),
   rating: z.number().int().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
   comment: z.string()
      .min(10, "Feedback must be atleast 10 characters")
      .max(500, "Feedback cannot exceed 500 characters")
});

export type RateInterviewerSchemaTypes = z.infer<typeof rateInterviewerSchema>;
