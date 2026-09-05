import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Helper to authenticate and verify interviewer role
export const getAuthenticatedInterviewer = async () => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: {
         id: true,
         role: true,
         creditBalance: true,
         creditRate: true,
         averageRating: true,
         totalRatings: true,
         designation: true,
         company: true,
         experience: true,
         expertise: true,
         bio: true
      }
   });

   if (!dbUser) {
      throw new NotFoundError("User not found");
   }

   if (dbUser.role !== "INTERVIEWER") {
      throw new ForbiddenError("Access restricted to interviewers");
   }

   return dbUser;
};