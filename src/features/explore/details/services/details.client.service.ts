import { api } from "@/lib/api";
import { BookSessionResponse, BookSessionData, BookSessionParams } from "../types/details.types";
import { BOOK_SESSION } from "@/config/query-urls";
import { apiError } from "@/lib/api-error";

export const handleBookSession = async ({ interviewerId, startTime, endTime }: BookSessionParams): Promise<BookSessionData> => {
   try {
      const res = await api.post(BOOK_SESSION, { json: { interviewerId, startTime, endTime } }).json<BookSessionResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError(error, "Failed to onboard user");
   }
};