import { apiErrorResponse, apiResponse } from "@/lib/api-response";
import { getPlatformConfig } from "@/services/server/global.server.service";

export async function GET() {
   try {
      const configData = await getPlatformConfig();

      return apiResponse({
         statusCode: 200,
         data: configData
      });
   } catch (error: unknown) {
      return apiErrorResponse({ error });
   }
}
