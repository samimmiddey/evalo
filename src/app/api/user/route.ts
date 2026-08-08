import { checkUser } from "@/services/server/user.server.service";
import { apiResponse } from "@/lib/api-response";

export async function GET() {
   try {
      const user = await checkUser();

      if (!user) {
         return apiResponse({
            statusCode: 404,
            message: "User not found"
         });
      }

      return apiResponse({
         statusCode: 200,
         data: user
      });
   } catch (error: unknown) {
      return apiResponse({
         statusCode: 500,
         message: "Internal Server Error",
         error
      });
   }
}