import { getDashboardSessions } from "@/features/interviews/sessions/services/session.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { NextRequest } from "next/server";
import { BookingStatus } from "@/generated/prisma/enums";

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const page = Number(searchParams.get("page")) || 1;
      const pageSize = Number(searchParams.get("pageSize")) || 10;
      const statusParam = searchParams.get("status");
      const search = searchParams.get("search") || undefined;

      const status =
         statusParam && statusParam !== "ALL"
            ? (statusParam as BookingStatus)
            : undefined;

      const sessions = await getDashboardSessions({
         page,
         pageSize,
         status,
         search
      });

      return apiResponse({
         statusCode: 200,
         data: sessions
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
