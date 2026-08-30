"use client";

import { COMPLETE_CALL, GENERATE_QUESTIONS } from "@/config/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { CompleteCallData, CompleteCallParams, CompleteCallResponse, GeneratedQuestion, GenerateQuestionsResponse } from "../types/call.types";

export const handleGenerateQuestions = async (expertise: string): Promise<GeneratedQuestion[]> => {
   try {
      const res = await api
         .post(GENERATE_QUESTIONS, {
            json: { expertise },
            timeout: 45000,
         })
         .json<GenerateQuestionsResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to generate questions"
      });
   }
};

export const handleCompleteCall = async ({ callId }: CompleteCallParams): Promise<CompleteCallData> => {
   try {
      const res = await api
         .post(COMPLETE_CALL, {
            json: { callId },
         })
         .json<CompleteCallResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to complete call"
      });
   }
};