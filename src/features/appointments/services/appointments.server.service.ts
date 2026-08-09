import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import { GetAppointmentsParams, GetAppointmentsServerResponse, AppointmentsStatsServerResponse } from "../types/appointments.types";
import { Prisma } from "@/generated/prisma/client";

export const getAppointments = async (params: GetAppointmentsParams = {}): Promise<GetAppointmentsServerResponse> => {
   const user = await currentUser();

   // Check if user is logged in
   if (!user) {
      return {
         success: false,
         message: "User not logged in"
      };
   }

   try {
      // Fetch db user
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true }
      });

      // Return error if user not found
      if (!dbUser) {
         return {
            success: false,
            message: "User not found"
         };
      }

      const {
         page = 1,
         pageSize = 10,
         search,
         status
      } = params;

      const andConditions: Prisma.BookingWhereInput[] = [
         { intervieweeId: dbUser.id }
      ];

      // If search is present, add search condition
      if (search) {
         andConditions.push({
            interviewer: {
               OR: [
                  { firstName: { contains: search, mode: 'insensitive' } },
                  { lastName: { contains: search, mode: 'insensitive' } },
                  { company: { contains: search, mode: 'insensitive' } },
                  { designation: { contains: search, mode: 'insensitive' } }
               ]
            }
         });
      }

      // If status is present, add status condition
      if (status) {
         andConditions.push({
            status
         });
      }

      const where: Prisma.BookingWhereInput = { AND: andConditions };

      // Get total count and appointments
      const [totalCount, appointments] = await Promise.all([
         db.booking.count({ where }),
         db.booking.findMany({
            where,
            include: {
               interviewer: {
                  select: {
                     firstName: true,
                     lastName: true,
                     email: true,
                     imageUrl: true,
                     designation: true,
                     company: true,
                     experience: true,
                     expertise: true,
                     creditRate: true,
                     averageRating: true,
                     totalRatings: true
                  }
               },
               feedback: true
            },
            orderBy: {
               startTime: 'desc'
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
         })
      ]);

      return {
         success: true,
         data: appointments,
         page,
         pageSize,
         totalCount,
         totalPages: Math.ceil(totalCount / pageSize),
         hasNextPage: page * pageSize < totalCount,
         hasPrevPage: page > 1
      };
   } catch (error) {
      return serverError(error, 'Failed to fetch appointments');
   }
};

// Get appointments stats
export const getAppointmentStats = async (): Promise<AppointmentsStatsServerResponse> => {
   const user = await currentUser();

   if (!user) {
      return {
         success: false,
         message: "User not logged in",
      };
   }

   try {
      const dbUser = await db.user.findUnique({
         where: { clerkUserId: user.id },
         select: { id: true },
      });

      if (!dbUser) {
         return {
            success: false,
            message: "User not found",
         };
      }

      const stats = await db.booking.groupBy({
         by: ["status"],
         where: {
            intervieweeId: dbUser.id,
         },
         _count: {
            _all: true,
         },
      });

      const completedCount =
         stats.find((item) => item.status === "COMPLETED")?._count._all ?? 0;

      const scheduledCount =
         stats.find((item) => item.status === "SCHEDULED")?._count._all ?? 0;

      const cancelledCount =
         stats.find((item) => item.status === "CANCELLED")?._count._all ?? 0;

      const totalCount =
         completedCount + scheduledCount + cancelledCount;

      const successRate =
         totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

      return {
         success: true,
         data: {
            totalCount,
            completedCount,
            scheduledCount,
            cancelledCount,
            successRate,
         },
      };
   } catch (error) {
      return serverError(error, "Failed to fetch appointment stats");
   }
};