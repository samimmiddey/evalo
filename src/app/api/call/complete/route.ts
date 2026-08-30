import { NextRequest } from "next/server";
import { completeCall } from "@/features/interviews/call/services/call.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
   try {
      const { callId } = (await request.json()) as { callId: string };
      const result = await completeCall(callId);

      return apiResponse({
         statusCode: 200,
         data: result,
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
