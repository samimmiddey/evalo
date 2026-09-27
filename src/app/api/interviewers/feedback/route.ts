import { getFeedback } from "@/features/interviews/interviewer-details/services/details.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const id = searchParams.get("id");

      if (!id) {
         return apiResponse({
            statusCode: 400,
            message: "Interviewer ID is required"
         });
      }

      const page = Number(searchParams.get("page")) || 1;
      const pageSize = Number(searchParams.get("pageSize")) || 10;

      const interviewers = await getFeedback({
         id,
         page,
         pageSize
      });

      return apiResponse({
         statusCode: 200,
         data: interviewers
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}