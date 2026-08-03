import { Interviewer } from "../../shared/explore.shared.types";

export interface Booking {
   startTime: Date | string;
   endTime: Date | string;
}

export interface InterviewerDetails extends Interviewer {
   bookingsAsInterviewer: Booking[];
   currentPlan: string;
}
