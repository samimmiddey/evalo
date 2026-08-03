import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { UserRole, AvailabilityStatus, Prisma, InterviewExpertise } from "@/generated/prisma/client";
import { GetInterviewersParams, GetInterviewersResponse } from "../../types/list.type";

// Get interviewers
export const getInterviewers = async (params: GetInterviewersParams = {}): Promise<GetInterviewersResponse> => {
   try {
      const {
         page = 1,
         pageSize = 10,
         search,
         expertise,
         experience,
      } = params;

      const andConditions: Prisma.UserWhereInput[] = [
         { role: UserRole.INTERVIEWER },
      ];

      if (search) {
         andConditions.push({
            OR: [
               { firstName: { contains: search, mode: "insensitive" } },
               { lastName: { contains: search, mode: "insensitive" } },
               { company: { contains: search, mode: "insensitive" } },
               { designation: { contains: search, mode: "insensitive" } },
            ],
         });
      }

      // expertise is InterviewExpertise[] — check the array contains this value
      if (expertise?.length) {
         andConditions.push({
            OR: expertise.map((exp) => ({
               expertise: { has: exp as InterviewExpertise },
            })),
         });
      }

      // experience is Int? — client sends bucket labels like "0-2", "3-5", "5+"
      if (experience?.length) {
         andConditions.push({
            OR: experience.map((bucket) => {
               if (bucket.endsWith("+")) {
                  const min = Number(bucket.replace("+", ""));
                  return { experience: { gte: min } };
               }
               const [min, max] = bucket.split("-").map(Number);
               return { experience: { gte: min, lte: max } };
            }),
         });
      }

      const where: Prisma.UserWhereInput = { AND: andConditions };

      const [totalCount, interviewers] = await Promise.all([
         db.user.count({ where }),
         db.user.findMany({
            where,
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
                  select: { startTime: true, endTime: true },
                  take: 1,
               },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
         }),
      ]);

      return {
         data: interviewers,
         page,
         pageSize,
         totalCount,
         totalPages: Math.ceil(totalCount / pageSize),
         hasNextPage: page * pageSize < totalCount,
         hasPrevPage: page > 1,
      };
   } catch (error: unknown) {
      return serverError(error, "Failed to get interviewers");
   };
};