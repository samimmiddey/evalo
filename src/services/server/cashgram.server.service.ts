import crypto from "crypto";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { PayoutStatus } from "@/generated/prisma/enums";
import { CashgramWebhookPayload } from "@/types/cashfree.types";

interface VerifyCashgramSignatureParams {
   rawBody: string;
   signatureHeader?: string | null;
   timestampHeader?: string | null;
   payloadSignature?: string | null;
   parsedParams?: Record<string, string>;
   secretKey: string;
}

const safeCompare = (a: string, b: string): boolean => {
   try {
      const bufferA = Buffer.from(a, "utf8");
      const bufferB = Buffer.from(b, "utf8");
      if (bufferA.length !== bufferB.length) return false;
      return crypto.timingSafeEqual(bufferA, bufferB);
   } catch {
      return a === b;
   }
};

const computeHeaderSignature = (rawBody: string, timestamp: string, secretKey: string): string => {
   return crypto
      .createHmac("sha256", secretKey)
      .update(timestamp + rawBody)
      .digest("base64");
};

const computePayloadSignature = (params: Record<string, string>, secretKey: string): string => {
   const sortedKeys = Object.keys(params)
      .filter((k) => k.toLowerCase() !== "signature")
      .sort();

   const postData = sortedKeys
      .map((k) => params[k])
      .filter((val) => val !== undefined && val !== null && val !== "")
      .join("");

   return crypto
      .createHmac("sha256", secretKey)
      .update(postData)
      .digest("base64");
};

export const verifyCashgramWebhookSignature = ({
   rawBody,
   signatureHeader,
   timestampHeader,
   payloadSignature,
   parsedParams,
   secretKey,
}: VerifyCashgramSignatureParams): boolean => {
   if (!secretKey) return false;

   // 1. Check Header-based signature (Payouts V2 format: timestamp + rawBody)
   if (signatureHeader && timestampHeader) {
      const expected = computeHeaderSignature(rawBody, timestampHeader, secretKey);
      if (safeCompare(expected, signatureHeader)) {
         return true;
      }
   }

   // 2. Check Payload-based signature (Cashgram / Payouts V1 format)
   const incomingSig = payloadSignature || parsedParams?.signature;
   if (incomingSig && parsedParams && Object.keys(parsedParams).length > 0) {
      const expected = computePayloadSignature(parsedParams, secretKey);
      if (safeCompare(expected, incomingSig)) {
         return true;
      }
   }

   return false;
};

export interface HandleCashgramWebhookResult {
   success: boolean;
   message: string;
   statusCode: number;
}

export const handleCashgramWebhook = async (
   payload: CashgramWebhookPayload
): Promise<HandleCashgramWebhookResult> => {
   try {
      const event = (payload.event || payload.type || "").toUpperCase();
      const cashgramId =
         payload.cashgramid ||
         payload.cashgramId ||
         payload.data?.cashgramid ||
         payload.data?.cashgramId;

      if (!cashgramId) {
         return {
            success: true,
            message: `Event ${event || "TEST"} acknowledged successfully`,
            statusCode: 200,
         };
      }

      const payout = await db.payout.findFirst({
         where: { cashgramId },
         include: {
            interviewer: {
               select: {
                  id: true,
                  creditBalance: true,
               },
            },
         },
      });

      if (!payout) {
         return {
            success: true,
            message: `No local payout found for cashgramId: ${cashgramId}`,
            statusCode: 200,
         };
      }

      switch (event) {
         case "CASHGRAM_REDEEMED":
         case "TRANSFER_SUCCESS":
         case "TRANSFER_ACKNOWLEDGED": {
            if (payout.status === PayoutStatus.PROCESSED) {
               return {
                  success: true,
                  message: "Payout is already marked as PROCESSED",
                  statusCode: 200,
               };
            }

            const rawUtr = payload.utr || payload.data?.transfer_utr;
            const utr = rawUtr ? String(rawUtr).trim() : null;

            await db.payout.update({
               where: { id: payout.id },
               data: {
                  status: PayoutStatus.PROCESSED,
                  processedAt: new Date(),
                  ...(utr ? { utr } : {}),
               },
            });

            return {
               success: true,
               message: `Payout ${payout.id} marked as PROCESSED`,
               statusCode: 200,
            };
         }

         case "CASHGRAM_EXPIRED": {
            if (payout.status === PayoutStatus.EXPIRED || payout.status === PayoutStatus.PROCESSED) {
               return {
                  success: true,
                  message: `Payout is already ${payout.status}`,
                  statusCode: 200,
               };
            }

            await db.$transaction([
               db.payout.update({
                  where: { id: payout.id },
                  data: {
                     status: PayoutStatus.EXPIRED,
                     processedAt: new Date(),
                  },
               }),
               db.user.update({
                  where: { id: payout.interviewerId },
                  data: {
                     creditBalance: {
                        increment: payout.credits,
                     },
                  },
               }),
               db.creditTransaction.create({
                  data: {
                     userId: payout.interviewerId,
                     amount: payout.credits,
                     type: "ADMIN_ADJUSTMENT",
                  },
               }),
            ]);

            return {
               success: true,
               message: `Payout ${payout.id} marked as EXPIRED and ${payout.credits} credits restored`,
               statusCode: 200,
            };
         }

         case "CASHGRAM_TRANSFER_REVERSAL":
         case "TRANSFER_REVERSED":
         case "TRANSFER_FAILED": {
            if (payout.status === PayoutStatus.REJECTED || payout.status === PayoutStatus.EXPIRED) {
               return {
                  success: true,
                  message: `Payout is already ${payout.status}`,
                  statusCode: 200,
               };
            }

            await db.$transaction([
               db.payout.update({
                  where: { id: payout.id },
                  data: {
                     status: PayoutStatus.REJECTED,
                     processedAt: new Date(),
                  },
               }),
               db.user.update({
                  where: { id: payout.interviewerId },
                  data: {
                     creditBalance: {
                        increment: payout.credits,
                     },
                  },
               }),
               db.creditTransaction.create({
                  data: {
                     userId: payout.interviewerId,
                     amount: payout.credits,
                     type: "ADMIN_ADJUSTMENT",
                  },
               }),
            ]);

            return {
               success: true,
               message: `Payout ${payout.id} marked as REJECTED and ${payout.credits} credits restored`,
               statusCode: 200,
            };
         }

         default: {
            return {
               success: true,
               message: `Unhandled event: ${event}`,
               statusCode: 200,
            };
         }
      }
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to handle Cashgram webhook event",
      });
   }
};
