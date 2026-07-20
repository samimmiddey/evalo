import { checkUser } from "@/services/server/user.service";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const user = await checkUser();

      if (!user) {
         return apiResponse({
            statusCode: 404,
            error: "User not found"
         });
      }

      return apiResponse({
         statusCode: 200,
         data: user
      });
   } catch (error) {
      return apiResponse({
         statusCode: 500,
         error: error instanceof Error ? error.message : "Internal Server Error"
      });
   }
}