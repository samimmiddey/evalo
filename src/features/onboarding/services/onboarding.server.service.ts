import { onboardingSchema, OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { CompleteSetupResponse } from "../types/onboarding.types";
import { PLAN_CREDITS } from "@/types/user.types";

// Complete onboarding setup
export const completeSetup = async (data: OnboardingSchemaTypes): Promise<CompleteSetupResponse> => {
   const { isAuthenticated, userId } = await auth();

   if (!isAuthenticated) {
      return { success: false, message: 'No signed-in user' };
   }

   const client = await clerkClient();

   try {
      const { role, firstName, lastName, designation, company, experience, expertise, bio } = onboardingSchema.parse(data);

      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
         return { success: false, message: 'No email on Clerk user' };
      }

      const interviewerFields = role === 'INTERVIEWER'
         ? { designation, company, experience: Number(experience), expertise, bio }
         : {};

      // Update user profile
      const updatedUser = await db.user.upsert({
         where: { clerkUserId: userId },
         update: {
            role,
            firstName,
            lastName,
            ...interviewerFields
         },
         create: {
            clerkUserId: userId,
            email,
            imageUrl: clerkUser.imageUrl,
            credits: PLAN_CREDITS.free,
            currentPlan: 'free',
            creditsLastAllocatedAt: new Date(),
            role,
            firstName,
            lastName,
            ...interviewerFields
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