"use client";

import { GET_INTERVIEWERS } from "@/config/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { GetInterviewersParams, GetInterviewersResponse, InterviewersResponse } from "../../types/explore.type";

export const getInterviewers = async (params: GetInterviewersParams = {}): Promise<GetInterviewersResponse> => {
   try {
      const { page, pageSize, search, expertise, experience } = params;
      const searchParams = new URLSearchParams();

      if (page) searchParams.set("page", page.toString());
      if (pageSize) searchParams.set("pageSize", pageSize.toString());
      if (search) searchParams.set("search", search);
      if (expertise) searchParams.set("expertise", expertise);
      if (experience?.length) {
         experience.forEach((exp) => searchParams.append("experience", exp));
      }

      const res = await api
         .get(`${GET_INTERVIEWERS}?${searchParams.toString()}`)
         .json<InterviewersResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError(error, "Failed to get interviewers");
   }
};