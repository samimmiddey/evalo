import { getAppointments } from "@/features/interviews/appointments/services/appointments.server.service";
import { InterviewStatus } from "@/features/interviews/appointments/types/appointments.types";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get('page')) || 1;
      const pageSize = Number(searchParams.get('pageSize')) || 10;
      const status = searchParams.get('status') as InterviewStatus || undefined;
      const search = searchParams.get('search') || undefined;

      const appointments = await getAppointments({
         page,
         pageSize,
         status,
         search
      });

      return apiResponse({
         statusCode: 200,
         data: appointments
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}