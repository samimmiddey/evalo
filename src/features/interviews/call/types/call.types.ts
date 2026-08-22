import { InterviewExpertise } from "@/generated/prisma/enums";

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