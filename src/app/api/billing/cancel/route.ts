import { cancelCandidateSubscription } from "@/features/interviews/billing/services/billing.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function POST() {
   try {
      const data = await cancelCandidateSubscription();

      return apiResponse({
         statusCode: 200,
         data
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
