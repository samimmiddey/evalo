import { NextResponse } from "next/server";

type ApiResponseOptions<T> =
   | {
      statusCode: number;
      data: T;
      error?: never;
   }
   | {
      statusCode: number;
      error: string;
      data?: never;
   };

export const apiResponse = <T>({
   statusCode,
   data,
   error,
}: ApiResponseOptions<T>) => {
   return NextResponse.json(
      {
         success: statusCode >= 200 && statusCode < 300,
         statusCode,
         ...(data !== undefined && { data }),
         ...(error !== undefined && { error }),
      },
      {
         status: statusCode,
      }
   );
};