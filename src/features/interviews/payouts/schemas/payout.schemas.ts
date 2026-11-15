import { MIN_PAYOUT_CREDITS } from "@/constants/interviews";
import { z } from "zod";

// Request payout schema
export const requestPayoutSchema = z.object({
   credits: z
      .number("Please enter a valid credit amount")
      .int("Credits must be a whole number")
      .min(MIN_PAYOUT_CREDITS, `Must withdraw at least ${MIN_PAYOUT_CREDITS} credits`)
});

export type RequestPayoutSchemaTypes = z.infer<typeof requestPayoutSchema>;
