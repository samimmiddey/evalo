import { InterviewExpertise } from "@/generated/prisma/enums";
import { BaseResponse } from "@/types/api.types";

export interface CallParticipant {
   id: string;
   clerkUserId: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
}

export interface CallInterviewer extends CallParticipant {
   expertise: InterviewExpertise[];
   experience: number | null;
   designation: string | null;
}

export interface Booking {
   id: string;
   interviewer: CallInterviewer;
   interviewee: CallParticipant;
   expertise: InterviewExpertise[];
   experience: number | null;
   designation: string | null;
   startTime: string;
   endTime: string;
   status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface CallCurrentUser {
   id: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
}

export interface CallData {
   token: string;
   isInterviewer: boolean;
   currentUser: CallCurrentUser;
   booking: Booking;
}

export type GetCallDataServerResponse = CallData;

export interface CompleteCallParams {
   callId: string;
}

export interface CompleteCallData {
   bookingId: string;
   status: "COMPLETED";
}

export type CompleteCallResponse = BaseResponse<CompleteCallData>;

export interface GeneratedQuestion {
   id: string;
   title: string;
   question: string;
   difficulty: "EASY" | "MEDIUM" | "HARD";
   expectedAnswer: string;
   followUpQuestion?: string;
}

export type GenerateQuestionsResponse = BaseResponse<GeneratedQuestion[]>;
