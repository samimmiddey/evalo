import { apiResponse } from "@/lib/api-response";
import { getInterviewers } from "@/features/interviewee/services/server/interviewee.service";

const isDev = process.env.NODE_ENV === 'development';

export async function GET() {
   try {
      const interviewers = await getInterviewers();

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