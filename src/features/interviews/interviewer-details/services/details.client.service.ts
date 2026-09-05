"use client";

import { api } from "@/lib/api";
import { BookSessionResponse, BookSession, BookSessionParams } from "../types/details.types";
import { BOOK_SESSION } from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

export const handleBookSession = async ({ interviewerId, startTime, endTime }: BookSessionParams): Promise<BookSession> => {
   try {
      const res = await api.post(BOOK_SESSION, { json: { interviewerId, startTime, endTime } }).json<BookSessionResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to book session"
      });
   }
};