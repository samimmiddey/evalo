import { getAppointmentStats } from "@/features/interviews/appointments/services/appointments.server.service";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const stats = await getAppointmentStats();

      if (!stats.success) {
         return apiResponse({
            statusCode: 404,
            message: stats.message ?? "Failed to fetch appointment stats"
         });
      }

      return apiResponse({
         statusCode: 200,
         data: stats.data
      });
   } catch (error) {
      return apiResponse({
         statusCode: 500,
         message: "Failed to fetch appointment stats",
         error
      });
   }
}