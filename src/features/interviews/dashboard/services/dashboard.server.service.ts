import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { getAuthenticatedInterviewer } from "../../shared/services/shared.server.service";
import { DashboardStats } from "../types/dashboard.types";
import { DashboardSession } from "../../shared/types/shared.types";

// Get Dashboard Overview Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const [
         totalSessions,
         completedSessions,
         scheduledSessions,
         cancelledSessions,
         totalEarningsResult,
         nextBooking
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
         }),
         db.booking.count({
            where: { interviewerId: interviewer.id, status: "CANCELLED" }
         }),
         db.creditTransaction.aggregate({
            where: {
               userId: interviewer.id,
               type: "BOOKING_EARNING"
            },
            _sum: {
               amount: true
            }
         }),
         db.booking.findFirst({
            where: {
               interviewerId: interviewer.id,
               status: "SCHEDULED",
               endTime: { gte: new Date() }
            },
            orderBy: { startTime: "asc" },
            include: {
               interviewee: {
                  select: {
                     id: true,
                     firstName: true,
                     lastName: true,
                     imageUrl: true,
                     email: true
                  }
               },
               feedback: true
            }
         })
      ]);

      const formattedNextSession: DashboardSession | null = nextBooking
         ? {
            id: nextBooking.id,
            startTime: nextBooking.startTime.toISOString(),
            endTime: nextBooking.endTime.toISOString(),
            status: nextBooking.status,
            streamStatus: nextBooking.streamStatus,
            creditsCharged: nextBooking.creditsCharged,
            streamCallId: nextBooking.streamCallId,
            recordingUrl: nextBooking.recordingUrl,
            candidate: {
               id: nextBooking.interviewee.id,
               firstName: nextBooking.interviewee.firstName,
               lastName: nextBooking.interviewee.lastName,
               imageUrl: nextBooking.interviewee.imageUrl,
               email: nextBooking.interviewee.email
            },
            feedback: nextBooking.feedback
               ? {
                  id: nextBooking.feedback.id,
                  summary: nextBooking.feedback.summary,
                  technical: nextBooking.feedback.technical,
                  communication: nextBooking.feedback.communication,
                  problemSolving: nextBooking.feedback.problemSolving,
                  recommendation: nextBooking.feedback.recommendation,
                  strengths: nextBooking.feedback.strengths,
                  improvements: nextBooking.feedback.improvements,
                  overallRating: nextBooking.feedback.overallRating,
                  sessionRating: nextBooking.feedback.sessionRating,
                  sessionComment: nextBooking.feedback.sessionComment,
                  createdAt: nextBooking.feedback.createdAt.toISOString()
               }
               : null,
            createdAt: nextBooking.createdAt.toISOString()
         }
         : null;

      return {
         totalSessions,
         completedSessions,
         scheduledSessions,
         cancelledSessions,
         totalEarnings: totalEarningsResult._sum.amount ?? 0,
         creditBalance: interviewer.creditBalance,
         creditRate: interviewer.creditRate,
         averageRating: interviewer.averageRating,
         totalRatings: interviewer.totalRatings,
         nextSession: formattedNextSession
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch dashboard stats"
      });
   }
};