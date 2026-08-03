import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { InterviewDetails } from "../../types/details.types";

// Get interviwer details
export const getInterviewerDetails = async (id: string): Promise<InterviewDetails> => {
   try {
      const interviewer = await db.user.findUnique({
         where: { id: id, role: 'INTERVIEWER' },
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
               where: { status: 'AVAILABLE' },
               select: { startTime: true, endTime: true },
               take: 1
            },
            bookingsAsInterviewer: {
               where: { status: "SCHEDULED" },
               select: { startTime: true, endTime: true }
            }
         }
      });

      if (!interviewer) {
         throw new Error('Interviewer not found');
      }

      return interviewer;
   } catch (error: unknown) {
      return serverError(error, 'Failed to fetch interviewer details');
   }
};