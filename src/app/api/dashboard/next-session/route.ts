import { getNextSession } from "@/features/interviews/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const nextSession = await getNextSession();

      return apiResponse({
         statusCode: 200,
         data: nextSession
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
