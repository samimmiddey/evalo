import { getAppointmentStats } from "@/features/interviews/appointments/services/appointments.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const stats = await getAppointmentStats();

      return apiResponse({
         statusCode: 200,
         data: stats
      });
   } catch (error) {
      return apiErrorResponse({ error });
   }
}