import { NextRequest } from "next/server";
import {
   handleCashgramWebhook,
   verifyCashgramWebhookSignature,
} from "@/services/server/cashgram.server.service";
import { CashgramWebhookPayload } from "@/types/cashfree.types";

export async function POST(request: NextRequest) {
   // Step 1: Verify server-side secret key configuration
   const secretKey = process.env.CASHFREE_CASHGRAM_SECRET_KEY;
   if (!secretKey) {
      // eslint-disable-next-line no-console
      console.error("Missing CASHFREE_CASHGRAM_SECRET_KEY in environment");
      return new Response("Missing Cashfree Cashgram secret key", { status: 500 });
   }

   // Step 2: Extract signature headers and raw request body
   const signatureHeader = request.headers.get("x-webhook-signature");
   const timestampHeader = request.headers.get("x-webhook-timestamp");
   const rawBody = await request.text();

   if (!rawBody) {
      return new Response("Empty payload", { status: 400 });
   }

   // Step 3: Parse the request payload (supports JSON and form-urlencoded formats)
   const parsedParams: Record<string, string> = {};
   let payload: CashgramWebhookPayload = {};

   const contentType = request.headers.get("content-type") || "";
   if (contentType.includes("application/json")) {
      try {
         payload = JSON.parse(rawBody) as CashgramWebhookPayload;
         for (const [key, val] of Object.entries(payload)) {
            if (typeof val === "string") {
               parsedParams[key] = val;
            } else if (typeof val === "number" || typeof val === "boolean") {
               parsedParams[key] = val.toString();
            }
         }
      } catch {
         return new Response("Invalid JSON payload", { status: 400 });
      }
   } else {
      try {
         const searchParams = new URLSearchParams(rawBody);
         searchParams.forEach((val, key) => {
            parsedParams[key] = val;
            (payload as Record<string, unknown>)[key] = val;
         });

         // Fallback: If content-type wasn't json but body starts with '{'
         if (Object.keys(parsedParams).length === 0 && rawBody.trim().startsWith("{")) {
            payload = JSON.parse(rawBody) as CashgramWebhookPayload;
            for (const [key, val] of Object.entries(payload)) {
               if (typeof val === "string") {
                  parsedParams[key] = val;
               } else if (typeof val === "number" || typeof val === "boolean") {
                  parsedParams[key] = val.toString();
               }
            }
         }
      } catch {
         return new Response("Invalid payload", { status: 400 });
      }
   }

   // Step 4: Validate cryptographic signature
   const isValid = verifyCashgramWebhookSignature({
      rawBody,
      signatureHeader,
      timestampHeader,
      payloadSignature: payload.signature,
      parsedParams,
      secretKey,
   });

   if (!isValid) {
      // eslint-disable-next-line no-console
      console.warn("Cashfree Cashgram webhook signature verification failed");
      return new Response("Invalid signature", { status: 400 });
   }

   // Step 5: Process event in the database
   try {
      const result = await handleCashgramWebhook(payload);
      return new Response(result.message, { status: result.statusCode });
   } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Cashfree Cashgram webhook processing error:", error);
      return new Response("Webhook processing failed", { status: 500 });
   }
}

// GET handler to verify endpoint health
export function GET() {
   return new Response("Cashgram webhook endpoint is active", { status: 200 });
}
