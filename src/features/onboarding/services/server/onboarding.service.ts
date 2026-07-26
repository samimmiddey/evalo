"use server";

import { onboardingSchema, OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CompleteSetupResponse } from "../../models/onboarding.types";

// Complete onboarding setup
export const completeSetup = async (data: OnboardingSchemaTypes): Promise<CompleteSetupResponse> => {
   const { isAuthenticated, userId } = await auth();

   if (!isAuthenticated) {
      return { success: false, message: 'No signed-in user' };
   }

   const client = await clerkClient();

   try {
      const { role, firstName, lastName, designation, company, experience, expertise, bio } = onboardingSchema.parse(data);

      // Update user profile
      const updatedUser = await db.user.update({
         where: { clerkUserId: userId },
         data: {
            role,
            firstName,
            lastName,
            ...(role === 'INTERVIEWER' && {
               designation,
               company,
               experience: Number(experience),
               expertise,
               bio
            })
         },
         select: { role: true }
      });

      // Update clerk user
      await client.users.updateUser(userId, {
         firstName,
         lastName,
      });

      // Update clerk metadata
      await client.users.updateUserMetadata(userId, {
         publicMetadata: {
            onboardingComplete: true,
            role
         }
      });

      return { success: true, role: updatedUser.role };
   } catch (error: unknown) {
      return serverError(error, 'Failed to complete onboarding');
   }
};