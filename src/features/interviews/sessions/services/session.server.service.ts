import { Prisma } from "@/generated/prisma/client";
import { getAuthenticatedInterviewer } from "../../shared/services/shared.server.service";
import { SessionsData, SessionsFilterParams } from "../types/session.types";
import { db } from "@/lib/prisma";
import { DashboardSession } from "../../shared/types/shared.types";
import { serverError } from "@/lib/server-error";

// Get Dashboard Booked Sessions
export const getDashboardSessions = async (
   filters?: SessionsFilterParams
): Promise<SessionsData> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 10;

      const whereClause: Prisma.BookingWhereInput = {
         interviewerId: interviewer.id
      };

      if (filters?.status && filters.status !== "ALL") {
         whereClause.status = filters.status;
      }

      if (filters?.search?.trim()) {
         const searchTerm = filters.search.trim();
         whereClause.interviewee = {
            OR: [
               { firstName: { contains: searchTerm, mode: "insensitive" } },
               { lastName: { contains: searchTerm, mode: "insensitive" } },
               { email: { contains: searchTerm, mode: "insensitive" } }
            ]
         };
      }

      const [totalCount, bookings] = await Promise.all([
         db.booking.count({ where: whereClause }),
         db.booking.findMany({
            where: whereClause,
            orderBy: { startTime: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
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

      const formattedSessions: DashboardSession[] = bookings.map((item) => ({
         id: item.id,
         startTime: item.startTime.toISOString(),
         endTime: item.endTime.toISOString(),
         status: item.status,
         streamStatus: item.streamStatus,
         creditsCharged: item.creditsCharged,
         streamCallId: item.streamCallId,
         recordingUrl: item.recordingUrl,
         candidate: {
            id: item.interviewee.id,
            firstName: item.interviewee.firstName,
            lastName: item.interviewee.lastName,
            imageUrl: item.interviewee.imageUrl,
            email: item.interviewee.email
         },
         feedback: item.feedback
            ? {
               id: item.feedback.id,
               summary: item.feedback.summary,
               technical: item.feedback.technical,
               communication: item.feedback.communication,
               problemSolving: item.feedback.problemSolving,
               recommendation: item.feedback.recommendation,
               strengths: item.feedback.strengths,
               improvements: item.feedback.improvements,
               overallRating: item.feedback.overallRating,
               sessionRating: item.feedback.sessionRating,
               sessionComment: item.feedback.sessionComment,
               createdAt: item.feedback.createdAt.toISOString()
            }
            : null,
         createdAt: item.createdAt.toISOString()
      }));

      return {
         data: formattedSessions,
         page,
         pageSize,
         totalCount,
         totalPages: Math.ceil(totalCount / pageSize),
         hasNextPage: page * pageSize < totalCount,
         hasPrevPage: page > 1
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch dashboard sessions"
      });
   }
};