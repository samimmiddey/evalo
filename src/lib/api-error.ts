import { HTTPError } from "ky";

interface ErrorResponse {
   success: false;
   statusCode: number;
   error: string;
}

export const apiError = async (error: unknown, fallbackMessage: string): Promise<never> => {
   if (error instanceof HTTPError) {
      const body = await error.response.json<ErrorResponse>().catch(() => null);
      throw new Error(body?.error ?? error.message);
   }

   if (error instanceof Error) {
      throw error;
   }

   throw new Error(fallbackMessage);
};