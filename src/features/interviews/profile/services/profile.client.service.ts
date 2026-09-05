import { api } from "@/lib/api";
import { UpdateInterviewerProfileSchemaTypes } from "../schema/profile.schema";
import { InterviewerProfileData, ProfileResponse } from "../types/profile.types";
import { UPDATE_PROFILE } from "@/constants/query-urls";
import { apiError } from "@/lib/api-error";

// Update Profile & Rates
export const updateInterviewerProfile = async (
   data: UpdateInterviewerProfileSchemaTypes
): Promise<InterviewerProfileData> => {
   try {
      const res = await api
         .patch(UPDATE_PROFILE, { json: data })
         .json<ProfileResponse>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to update profile settings"
      });
   }
};