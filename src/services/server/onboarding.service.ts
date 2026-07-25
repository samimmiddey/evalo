"use server";

import { onboardingSchema, OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Complete onboarding setup
export const completeSetup = async (data: OnboardingSchemaTypes) => {
   const { isAuthenticated, userId } = await auth();

   if (!isAuthenticated) {
      return { message: 'No signed-in user' };
   }

   const client = await clerkClient();


   try {
      const { role, name, designation, company, experience, expertise, bio } = onboardingSchema.parse(data);

      // Update user profile
      await db.user.update({
         where: { clerkUserId: userId },
         data: {
            role,
            name,
            designation,
            company,
            experience: Number(experience),
            expertise,
            bio
         }
      });

      // Update clerk user
      await client.users.updateUserMetadata(userId, {
         publicMetadata: {
            onboardingComplete: true,
         }
      });

      return { success: true };
   } catch (error: unknown) {
      if (error instanceof Error) {
         throw error;
      }

      throw new Error("Something went wrong");
   }
};