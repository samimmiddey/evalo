import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { completeSetup } from "@/features/onboarding/services/onboarding.server.service";
import { OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";

export async function POST(req: Request) {
   try {
      const body = await req.json() as OnboardingSchemaTypes;

      const role = await completeSetup(body);

      return apiResponse({
         statusCode: 200,
         data: { role }
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}