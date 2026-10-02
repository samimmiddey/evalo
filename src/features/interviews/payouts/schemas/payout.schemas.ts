import { z } from "zod";

// Request payout schema
export const requestPayoutSchema = z.object({
   credits: z.number().int().min(1, "Must withdraw at least 1 credit")
});

export type RequestPayoutSchemaTypes = z.infer<typeof requestPayoutSchema>;
