"use client";

import { api } from "@/lib/api";
import { BookSessionResponse, BookSession, BookSessionParams, GetFeedbackParams, InterviewerFeedback, InterviewerFeedbackResponse } from "../types/details.types";
import { BOOK_SESSION, GET_FEEDBACK } from "@/constants/query-urls";
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

// Get feedback
export const getFeedback = async (params: GetFeedbackParams): Promise<InterviewerFeedback> => {
   try {
      const { id, page, pageSize } = params;

      if (!id) {
         throw new Error("Interviewer ID is required");
      }

      const searchParams = new URLSearchParams();

      if (id) searchParams.set('id', id.toString());
      if (page) searchParams.set('page', page.toString());
      if (pageSize) searchParams.set('pageSize', pageSize.toString());

      const res = await api.get(`${GET_FEEDBACK}?${searchParams.toString()}`).json<InterviewerFeedbackResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;

   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to get feedback"
      });
   }
};