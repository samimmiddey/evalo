import { getCandidateBillingData } from "@/features/interviews/billing/services/billing.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const data = await getCandidateBillingData();

      return apiResponse({
         statusCode: 200,
         data
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
