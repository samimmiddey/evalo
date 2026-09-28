import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedInterviewer } from "../../shared/services/shared.server.service";
import { DashboardNextSession, DashboardStats } from "../types/dashboard.types";
import { currentUser } from "@clerk/nextjs/server";
import { NotFoundError, UnauthorizedError } from "@/lib/app-error";

// Get Dashboard Overview Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const [
         totalSessions,
         completedSessions,
         scheduledSessions
      ] = await Promise.all([
         db.booking.count({
            where: { interviewerId: interviewer.id }
         }),
         db.booking.count({
            where: { interviewerId: interviewer.id, status: "COMPLETED" }
         }),
         db.booking.count({
            where: {
               interviewerId: interviewer.id,
               status: "SCHEDULED",
               endTime: { gte: new Date() }
            }
         })
      ]);

      return {
         totalSessions,
         completedSessions,
         scheduledSessions,
         creditBalance: interviewer.creditBalance,
         creditRate: interviewer.creditRate,
         averageRating: interviewer.averageRating,
         totalRatings: interviewer.totalRatings
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch dashboard stats"
      });
   }
};

// Get Next Active / Upcoming Session for the logged-in user
export const getNextSession = async (): Promise<DashboardNextSession | null> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError("Unauthenticated user");
   }

   try {
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true, role: true }
      });

      if (!dbUser) {
         throw new NotFoundError("User not found");
      }

      const now = new Date();

      if (dbUser.role === "CANDIDATE") {
         const booking = await db.booking.findFirst({
            where: {
               candidateId: dbUser.id,
               status: { in: ["SCHEDULED", "COMPLETED"] },
               endTime: { gte: now }
            },
            orderBy: { startTime: "asc" },
            include: {
               interviewer: {
                  select: {
                     firstName: true,
                     lastName: true,
                     imageUrl: true,
                     designation: true,
                     company: true
                  }
               }
            }
         });

         if (!booking) return null;

         const name = `${booking.interviewer.firstName ?? ""} ${booking.interviewer.lastName ?? ""}`.trim() || "Interviewer";
         const subtitle = [booking.interviewer.designation, booking.interviewer.company].filter(Boolean).join(" • ") || "Interviewer";

         return {
            id: booking.id,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            status: booking.status,
            streamCallId: booking.streamCallId,
            streamStatus: booking.streamStatus,
            counterpart: {
               name,
               imageUrl: booking.interviewer.imageUrl,
               fallbackInitial: booking.interviewer.firstName?.[0] ?? "I",
               subtitle
            }
         };
      }

      // Interviewer
      const booking = await db.booking.findFirst({
         where: {
            interviewerId: dbUser.id,
            status: { in: ["SCHEDULED", "COMPLETED"] },
            endTime: { gte: now }
         },
         orderBy: { startTime: "asc" },
         include: {
            candidate: {
               select: {
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                  email: true
               }
            }
         }
      });

      if (!booking) return null;

      const name = `${booking.candidate.firstName ?? ""} ${booking.candidate.lastName ?? ""}`.trim() || booking.candidate.email;

      return {
         id: booking.id,
         startTime: booking.startTime.toISOString(),
         endTime: booking.endTime.toISOString(),
         status: booking.status,
         streamCallId: booking.streamCallId,
         streamStatus: booking.streamStatus,
         counterpart: {
            name,
            imageUrl: booking.candidate.imageUrl,
            fallbackInitial: booking.candidate.firstName?.[0] ?? "C",
            subtitle: `Candidate • ${booking.creditsCharged} Credits Booked`
         }
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch next session"
      });
   }
};