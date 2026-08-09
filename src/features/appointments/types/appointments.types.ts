import { Feedback } from "@/generated/prisma/client";
import { InterviewExpertise, StreamStatus } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface GetAppointmentsParams {
   page?: number;
   pageSize?: number;
   search?: string;
   status?: InterviewStatus;
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

export interface Interview {
   id: string;
   startTime: string | Date;
   endTime: string | Date;
   status: InterviewStatus;
   streamStatus: StreamStatus;
   interviewer: Interviewer;
   feedback: Feedback | null;
}

export interface AppointmentsData {
   success: true,
   data: Interview[];
   page: number;
   pageSize: number;
   totalCount: number;
   totalPages: number;
   hasNextPage: boolean;
   hasPrevPage: boolean;
}

export type GetAppointmentsServerResponse =
   | { success: false, message: string; }
   | AppointmentsData;

export type GetAppointmentsClientResponse = BaseResponse<AppointmentsData>;