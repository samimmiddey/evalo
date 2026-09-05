import { getDashboardStats } from "@/features/interviews/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const stats = await getDashboardStats();

      return apiResponse({
         statusCode: 200,
         data: stats
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
