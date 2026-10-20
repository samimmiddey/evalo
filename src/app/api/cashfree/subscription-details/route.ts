import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/app-error";
import { getSubscription } from "@/services/server/cashfree.server.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
         throw new ValidationError("Subscription ID is required");
      }

      const res = await getSubscription(id);

      return apiResponse({
         statusCode: 200,
         data: res
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
