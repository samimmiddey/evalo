import { z } from "zod";

// Request payout schema
export const requestPayoutSchema = z.object({
   credits: z
      .number("Please enter a valid credit amount")
      .int("Credits must be a whole number")
      .positive("Credits must be greater than 0")
});

export type RequestPayoutSchemaTypes = z.infer<typeof requestPayoutSchema>;
