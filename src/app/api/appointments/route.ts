import { getInterviews } from "@/features/appointments/services/appointments.server.service";
import { InterviewStatus } from "@/features/appointments/types/appointments.types";
import { apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get('page')) || 1;
      const pageSize = Number(searchParams.get('pageSize')) || 10;
      const status = searchParams.get('status') as InterviewStatus || undefined;
      const search = searchParams.get('search') || undefined;

      const interviews = await getInterviews({
         page,
         pageSize,
         status,
         search
      });

      if (!interviews.success) {
         return apiResponse({
            statusCode: 404,
            message: interviews.message ?? 'Failed to fetch interviews'
         });
      }

      return apiResponse({
         statusCode: 200,
         data: interviews
      });
   } catch (error: unknown) {
      return apiResponse({
         statusCode: 500,
         message: 'Failed to fetch interviews',
         error
      });
   }
}