import { Feedback } from "@/generated/prisma/client";
import { InterviewExpertise, StreamStatus } from "@/generated/prisma/enums";

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface GetInterviewsParams {
   page?: number;
   pageSize?: number;
   search?: string;
   status?: InterviewStatus;
}

export interface Interview {
   id: string;
   startTime: string | Date;
   endTime: string | Date;
   status: InterviewStatus;
   streamStatus: StreamStatus;
   interviewer: Interviewer;
   feedback: Feedback | null;
}

export interface Interviewer {
   firstName: string | null;
   lastName: string | null;
   email: string;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   experience: number | null;
   expertise: InterviewExpertise[] | null;
   creditRate: number | null;
   averageRating: number | null;
   totalRatings: number | null;
}

export type GetInterviewsResponse =
   | { success: false, message: string; }
   | {
      success: true,
      data: Interview[];
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
   };