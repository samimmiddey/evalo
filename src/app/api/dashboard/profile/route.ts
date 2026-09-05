import { UpdateInterviewerProfileSchemaTypes } from "@/features/interviews/profile/schema/profile.schema";
import { updateInterviewerProfile } from "@/features/interviews/profile/services/profile.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
   try {
      const body = (await request.json()) as UpdateInterviewerProfileSchemaTypes;
      const result = await updateInterviewerProfile(body);

      return apiResponse({
         statusCode: 200,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
