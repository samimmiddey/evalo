import { NextRequest } from "next/server";
import { StreamWebhookBody } from "@/types/stream.types";
import { processStreamBusinessWebhook } from "@/services/server/stream.server.service";
import { StreamClient } from "@stream-io/node-sdk";

export async function POST(request: NextRequest) {
   const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
   const secretKey = process.env.STREAM_SECRET_KEY;

   if (!apiKey || !secretKey) {
      return new Response("Missing Stream credentials", { status: 500 });
   }

   const signature = request.headers.get("x-signature") ?? "";
   const rawBody = await request.text();

   const streamClient = new StreamClient(apiKey, secretKey);
   if (!signature || !streamClient.verifyWebhook(rawBody, signature)) {
      return new Response("Invalid Signature", { status: 401 });
   }

   try {
      const body = JSON.parse(rawBody) as StreamWebhookBody;
      const eventType = body.type;

      if (eventType === 'call.session_ended' || eventType === 'call.stats_report_ready') {
         const result = await processStreamBusinessWebhook(body);
         return new Response(result.message, { status: result.statusCode });
      }

      // Acknowledge other event types with HTTP 200 so Stream doesn't retry
      return new Response("Event acknowledged", { status: 200 });
   } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to handle stream-business webhook:", error);
      return new Response("Internal Server Error", { status: 500 });
   }
}
