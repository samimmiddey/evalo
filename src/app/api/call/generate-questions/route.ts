import { NextRequest } from "next/server";
import { generateInterviewQuestions } from "@/features/interviews/call/services/call.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
   try {
      const { expertise } = (await request.json()) as { expertise: string };
      const questions = await generateInterviewQuestions(expertise);

      return apiResponse({
         statusCode: 200,
         data: questions
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}