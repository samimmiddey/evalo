import { checkUser } from "@/services/server/user.server.service";
import { apiErrorResponse, apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const user = await checkUser();

      return apiResponse({
         statusCode: 200,
         data: user
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}