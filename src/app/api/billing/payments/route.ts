import { getCandidatePayments } from "@/features/interviews/billing/services/billing.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);

      const page = Number(searchParams.get("page")) || 1;
      const pageSize = Number(searchParams.get("pageSize")) || 10;

      const data = await getCandidatePayments({ page, pageSize });

      return apiResponse({
         statusCode: 200,
         data
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
