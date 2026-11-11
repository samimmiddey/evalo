import { NextRequest } from "next/server";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { checkUserAuthStatus } from "@/features/auth/services/auth.server.service";
import { ValidationError } from "@/lib/app-error";
import { CheckAccountStatusBody } from "@/features/auth/types/auth.types";

export async function POST(req: NextRequest) {
   try {
      const body = (await req.json()) as CheckAccountStatusBody;
      const email = body?.email;

      if (!email || typeof email !== "string") {
         throw new ValidationError("Valid email address is required");
      }

      const result = await checkUserAuthStatus(email);

      return apiResponse({
         statusCode: 200,
         data: result
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
