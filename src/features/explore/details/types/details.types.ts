import { Interviewer } from "../../shared/explore.shared.types";

export interface Booking {
   startTime: Date | string;
   endTime: Date | string;
}

export interface InterviewerDetails extends Interviewer {
   bookingsAsInterviewer: Booking[];
   currentPlan: string;
}

export interface IntervieweeDetails {
   firstName: string | null;
   lastName: string | null;
   imageUrl: string | null;
   designation: string | null;
   company: string | null;
   createdAt: Date;
}

export interface FeedbackDetails {
   sessionRating: number | null;
   sessionComment: string | null;
}

export interface FeedbackData {
   id: string;
   interviewee: IntervieweeDetails;
   feedback: FeedbackDetails | null;
}

export interface InterviewerFeedback {
   bookingsAsInterviewer: FeedbackData[];
}