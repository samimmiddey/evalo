import { cancelBooking } from "@/features/interviews/appointments/services/appointments.server.service";
import { apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { bookingId } = await request.json() as { bookingId: string; };
      const result = await cancelBooking(bookingId);

      if (result && !result.success) {
         return apiResponse({
            statusCode: 400,
            message: result.message ?? 'Failed to cancel booking'
         });
      }

      return apiResponse({
         statusCode: 200,
         data: {
            message: result.message ?? 'Booking cancelled successfully'
         }
      });
   } catch (error: unknown) {
      return apiResponse({
         statusCode: 500,
         message: "Internal Server Error",
         error
      });
   }
}