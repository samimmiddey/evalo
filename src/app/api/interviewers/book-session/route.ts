import { bookSession } from "@/features/interviews/interviewer-details/services/details.server.service";
import { BookSessionParams } from "@/features/interviews/interviewer-details/types/details.types";
import { apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json() as BookSessionParams;
      const result = await bookSession(body);

      if (result && !result.success) {
         return apiResponse({
            statusCode: 400,
            message: result.message ?? 'Failed to book session'
         });
      }

      return apiResponse({
         statusCode: 200,
         data: {
            bookingId: result.booking,
            streamCallId: result.streamCallId,
            streamStatus: result.streamStatus
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