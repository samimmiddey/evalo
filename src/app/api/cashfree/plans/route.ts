import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { fetchPlans } from "@/services/server/cashfree.server.service";

export async function GET() {
   try {
      const plans = await fetchPlans();

      return apiResponse({
         statusCode: 200,
         data: plans
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
