import { apiResponse } from "@/lib/api-response";
import { completeSetup } from "@/features/onboarding/services/onboarding.server.service";
import { OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";

export async function POST(req: Request) {
   try {
      const body = await req.json() as OnboardingSchemaTypes;

      const result = await completeSetup(body);

      if (result && !result.success) {
         return apiResponse({
            statusCode: result.message === 'No signed-in user' ? 401 : 400,
            message: result.message ?? 'Onboarding failed'
         });
      }

      return apiResponse({
         statusCode: 200,
         data: { role: result.role }
      });
   } catch (error: unknown) {
      return apiResponse({
         statusCode: 500,
         message: "Internal Server Error",
         error
      });
   }
}