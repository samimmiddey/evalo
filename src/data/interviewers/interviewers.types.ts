import { LucideIcon } from "lucide-react";

export type ExpertiseEnum =
   | "FRONTEND"
   | "BACKEND"
   | "FULLSTACK"
   | "DEVOPS"
   | "DSA"
   | "SYSTEM_DESIGN"
   | "MOBILE"
   | "ML_AI"
   | "SECURITY"
   | "QA"
   | "CLOUD";

export type ExperienceEnum = "0-2" | "3-5" | "6-9" | "10+";

export interface ExpertiseItem {
   label: string;
   value: ExpertiseEnum;
}

export interface ExperienceItem {
   label: string;
   value: ExperienceEnum;
}

export interface InterviewersHeaderData {
   title: string;
   description: string;
}

export interface InterviewersSearchData {
   placeholder: string;
}

export interface InterviewersFiltersData {
   title: string;
   clearButton: string;
   applyButton: string;
   clearTooltip: string;
   expertiseTitle: string;
   experienceTitle: string;
}

export interface InterviewersCardData {
   viewProfileButton: string;
   fallbackBio: string;
}

export interface InterviewersNoData {
   title: string;
   body: string;
}

export interface DetailsCardHeader {
   title: string;
   icon: LucideIcon;
}

export interface AppointmentModalData {
   title: string;
   description: string;
}

export interface InterviewerDetailsStatic {
   backBtn: DetailsCardHeader;
   scheduleButton: string;
   creditRate: number;
   bio: DetailsCardHeader;
   whatToExpect: DetailsCardHeader;
   testimonial: DetailsCardHeader & {
      noFeedbackText: string;
   };
   booking: DetailsCardHeader;
   appointmentModal: AppointmentModalData;
   noSlotsText: string;
   noInterviewerText: string;
}

export interface InterviewersDataStatic {
   header: InterviewersHeaderData;
   search: InterviewersSearchData;
   filters: InterviewersFiltersData;
   expertise: ExpertiseItem[];
   experience: ExperienceItem[];
   card: InterviewersCardData;
   noData: InterviewersNoData;
   details: InterviewerDetailsStatic;
}

export type InterviewersData = InterviewersDataStatic;
