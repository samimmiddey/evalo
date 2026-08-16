import { NextResponse } from "next/server";

type ApiResponseOptions<T> =
   | {
      statusCode: number;
      data: T;
      error?: never;
      message?: string;
   }
   | {
      statusCode: number;
      error?: unknown;
      data?: never;
      message: string;
   };

export const apiResponse = <T>({
   statusCode,
   data,
   error,
   message
}: ApiResponseOptions<T>) => {
   const errorMessage = error instanceof Error ? error.message : message;

   return NextResponse.json(
      {
         success: statusCode >= 200 && statusCode < 300,
         statusCode,
         ...(data !== undefined && { data }),
         ...(errorMessage !== undefined && { error: errorMessage }),
      },
      {
         status: statusCode,
      }
   );
};