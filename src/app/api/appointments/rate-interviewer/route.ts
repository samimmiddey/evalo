import { RateInterviewerSchemaTypes } from "@/features/interviews/appointments/schemas/appointments.schemas";
import { rateInterviewer } from "@/features/interviews/appointments/services/appointments.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as RateInterviewerSchemaTypes;
      const result = await rateInterviewer(body);

      return apiResponse({
         statusCode: 200,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
