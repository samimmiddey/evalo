"use client";

import { GET_INTERVIEWERS } from "@/config/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { Interviewer, InterviewersResponse } from "../../types/interviewee.type";

export const getInterviewers = async (): Promise<Interviewer[]> => {
   try {
      const res = await api.get(GET_INTERVIEWERS).json<InterviewersResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError(error, "Failed to get interviewers");
   }
};