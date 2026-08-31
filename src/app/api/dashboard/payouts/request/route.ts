import { RequestPayoutSchemaTypes } from "@/features/interviews/dashboard/schemas/dashboard.schemas";
import { requestPayout } from "@/features/interviews/dashboard/services/dashboard.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as RequestPayoutSchemaTypes;
      const result = await requestPayout(body);

      return apiResponse({
         statusCode: 201,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
