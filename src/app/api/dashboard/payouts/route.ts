import { getPayoutsAndTransactions } from "@/features/interviews/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const data = await getPayoutsAndTransactions();

      return apiResponse({
         statusCode: 200,
         data
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
