import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { getInterviewers } from "@/features/interviews/interviewer-list/services/list.server.service";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get("page")) || 1;
      const pageSize = Number(searchParams.get("pageSize")) || 10;
      const search = searchParams.get("search") || undefined;
      const expertise = searchParams.getAll("expertise");
      const experience = searchParams.getAll("experience");

      const interviewers = await getInterviewers({
         page,
         pageSize,
         search,
         expertise: expertise.length ? expertise : undefined,
         experience: experience.length ? experience : undefined,
      });

      return apiResponse({
         statusCode: 200,
         data: interviewers
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}