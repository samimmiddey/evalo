"use client";

import { ONBOARDING_USER } from "@/constants/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { Onboarding, OnboardingResponse } from "../types/onboarding.types";
import { OnboardingSchemaTypes } from "../schemas/onboarding.schemas";

export const onboardUser = async (data: OnboardingSchemaTypes): Promise<Onboarding> => {
   try {
      const res = await api.post(ONBOARDING_USER, { json: data }).json<OnboardingResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to onboard user"
      });
   }
};