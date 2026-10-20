import { NextRequest } from "next/server";
import {
   handleCashfreeSubscriptionWebhook,
   verifyCashfreeWebhookSignature,
} from "@/services/server/cashfree.server.service";
import { CashfreeSubscriptionWebhookPayload } from "@/types/cashfree.types";

// Listens for real-time subscription lifecycle and recurring debit events:
// - SUBSCRIPTION_STATUS_CHANGED (Authorization, Activation, Cancellation, Expiry)
// - SUBSCRIPTION_PAYMENT_SUCCESS (Successful recurring billing debit)
// - SUBSCRIPTION_PAYMENT_FAILED (Failed recurring debit attempt)
//
export async function POST(request: NextRequest) {
   // Step 1: Verify server-side Cashfree secret key configuration
   const secretKey = process.env.CASHFREE_PG_SECRET_KEY;
   if (!secretKey) {
      return new Response("Missing Cashfree secret key", { status: 500 });
   }

   // Step 2: Extract Cashfree signature headers and the raw request body
   // CRITICAL: We must read the raw body as plain text (not parsed JSON)
   // to ensure HMAC hash calculation matches Cashfree's signature exactly
   const signature = request.headers.get("x-webhook-signature") ?? "";
   const timestamp = request.headers.get("x-webhook-timestamp") ?? "";
   const rawBody = await request.text();

   // Step 3: Validate the cryptographic HMAC-SHA256 signature
   const isValid = verifyCashfreeWebhookSignature({
      signature,
      rawBody,
      timestamp,
      secretKey,
   });

   if (!isValid) {
      return new Response("Invalid signature", { status: 400 });
   }

   // Step 4: Parse the validated raw payload into typed webhook data
   let payload: CashfreeSubscriptionWebhookPayload;
   try {
      payload = JSON.parse(rawBody) as CashfreeSubscriptionWebhookPayload;
   } catch {
      return new Response("Invalid payload", { status: 400 });
   }

   // Step 5: Process the event in the database (idempotent state updates & credit grants)
   try {
      await handleCashfreeSubscriptionWebhook(payload);
      // Return 200 OK immediately to acknowledge successful processing to Cashfree
      return new Response("OK", { status: 200 });
   } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error("Cashfree webhook processing error:", error);
      // Return 500 so Cashfree will automatically retry webhook delivery on failure
      return new Response("Webhook processing failed", { status: 500 });
   }
}
