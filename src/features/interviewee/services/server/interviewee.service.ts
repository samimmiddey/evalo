import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { UserRole, AvailabilityStatus } from "@/generated/prisma/client";
import { Interviewer } from "../../types/interviewee.type";

// Get interviewers
export const getInterviewers = async (): Promise<Interviewer[]> => {
   try {
      const interviewers = await db.user.findMany({
         where: { role: UserRole.INTERVIEWER },
         select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            designation: true,
            company: true,
            expertise: true,
            experience: true,
            bio: true,
            creditRate: true,
            averageRating: true,
            totalRatings: true,
            availabilities: {
               where: { status: AvailabilityStatus.AVAILABLE },
               select: {
                  startTime: true,
                  endTime: true,
               },
               take: 1
            },
         },
         orderBy: { createdAt: "desc" }
      });

      return interviewers;
   } catch (error: unknown) {
      return serverError(error, "Failed to get interviewers");
   };
};