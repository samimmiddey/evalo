import { isHTTPError } from "ky";

interface ErrorResponse {
   success: false;
   statusCode: number;
   error: string;
}

const isDev = process.env.NODE_ENV === 'development';

export const apiError = (error: unknown, fallbackMessage: string): never => {
   if (isHTTPError(error)) {
      const data = error.data as ErrorResponse | undefined;
      throw new Error(isDev ? (data?.error ?? fallbackMessage) : fallbackMessage);
   }

   if (error instanceof Error) {
      throw new Error(isDev ? error.message : fallbackMessage);
   }

   throw new Error(fallbackMessage);
};