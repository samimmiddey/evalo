import { cancelBooking } from "@/features/interviews/appointments/services/appointments.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const { bookingId } = await request.json() as { bookingId: string; };
      await cancelBooking(bookingId);

      return apiResponse({
         statusCode: 200,
         data: null
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}