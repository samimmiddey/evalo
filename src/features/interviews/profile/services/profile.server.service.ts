import { db } from "@/lib/prisma";
import { getAuthenticatedInterviewer } from "../../shared/services/shared.server.service";
import { updateInterviewerProfileSchema, UpdateInterviewerProfileSchemaTypes } from "../schema/profile.schema";
import { InterviewerProfileData } from "../types/profile.types";
import { serverError } from "@/lib/server-error";

// Update Interviewer Profile & Rates
export const updateInterviewerProfile = async (
   data: UpdateInterviewerProfileSchemaTypes
): Promise<InterviewerProfileData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const parsed = updateInterviewerProfileSchema.parse(data);

      const updated = await db.user.update({
         where: { id: interviewer.id },
         data: {
            designation: parsed.designation,
            company: parsed.company,
            experience: parsed.experience,
            expertise: parsed.expertise,
            bio: parsed.bio
         },
         select: {
            designation: true,
            company: true,
            experience: true,
            expertise: true,
            bio: true
         }
      });

      return updated;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to update profile"
      });
   }
};