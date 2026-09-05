import { BookingStatus, FeedbackRating, StreamStatus } from "@/generated/prisma/enums";

export interface Availability {
   startTime: Date | string;
   endTime: Date | string;
}

export interface Interviewer {
   id: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   expertise: string[];
   experience: number | null;
   bio: string | null;
   creditRate: number;
   availabilities: Availability[];
   averageRating: number | null;
   totalRatings: number;
}

export interface CandidateInfo {
   id: string;
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   email: string;
}

export interface SessionFeedback {
   id: string;
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: FeedbackRating;
   sessionRating: number | null;
   sessionComment: string | null;
   createdAt: string;
}

export interface DashboardSession {
   id: string;
   startTime: string;
   endTime: string;
   status: BookingStatus;
   streamStatus: StreamStatus;
   creditsCharged: number;
   streamCallId: string | null;
   recordingUrl: string | null;
   candidate: CandidateInfo;
   feedback: SessionFeedback | null;
   createdAt: string;
}