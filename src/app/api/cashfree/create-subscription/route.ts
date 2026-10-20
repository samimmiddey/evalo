import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { createSubscription } from "@/services/server/cashfree.server.service";
import { CreateSubscriptionParams } from "@/types/cashfree.types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const params = await request.json() as CreateSubscriptionParams;

      const res = await createSubscription(params);

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
