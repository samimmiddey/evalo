import { z } from "zod";

// Request payout schema
export const requestPayoutSchema = z.object({
   credits: z.number().int().min(1, "Must withdraw at least 1 credit"),
   paymentMethod: z.string().min(1, "Payment method is required"),
   paymentDetail: z.string().min(3, "Payment details must be at least 3 characters").max(200, "Details too long")
});

export type RequestPayoutSchemaTypes = z.infer<typeof requestPayoutSchema>;
