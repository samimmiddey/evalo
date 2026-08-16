import { bookSession } from "@/features/interviews/interviewer-details/services/details.server.service";
import { BookSessionParams } from "@/features/interviews/interviewer-details/types/details.types";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json() as BookSessionParams;
      const result = await bookSession(body);

      return apiResponse({
         statusCode: 200,
         data: {
            booking: result.booking,
            streamCallId: result.streamCallId,
            streamStatus: result.streamStatus
         }
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}