import { apiResponse } from "@/lib/api-response";
import { getInterviewers } from "@/features/explore/list/services/list.server.service";
import { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === 'development';

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

      if (!interviewers) {
         return apiResponse({
            statusCode: 404,
            error: "Interviewers not found"
         });
      }

      return apiResponse({
         statusCode: 200,
         data: interviewers
      });
   } catch (error: unknown) {
      return apiResponse({
         statusCode: 500,
         error: isDev && error instanceof Error ? error.message : "Internal Server Error"
      });
   }
}