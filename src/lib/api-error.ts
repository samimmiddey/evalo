import { isHTTPError } from "ky";

interface ErrorResponse {
   success: false;
   statusCode: number;
   error: string;
}

export const apiError = (error: unknown, fallbackMessage: string): never => {
   if (isHTTPError(error)) {
      const data = error.data as ErrorResponse | undefined;
      throw new Error(data?.error ?? fallbackMessage);
   }

   if (error instanceof Error) {
      throw error;
   }

   throw new Error(fallbackMessage);
};