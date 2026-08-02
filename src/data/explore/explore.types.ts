import { Interviewer } from "@/features/explore/list/types/explore.type";

export type ExpertiseEnum = "FRONTEND" | "BACKEND" | "FULLSTACK" | "DEVOPS" | "DSA" | "SYSTEM_DESIGN" | "MOBILE" | "ML_AI" | "SECURITY" | "QA" | "CLOUD";

export type ExperienceEnum = '0-2' | '3-5' | '6-9' | '10+';

export interface Expertise {
   label: string;
   value: ExpertiseEnum;
}

export interface Experience {
   label: string;
   value: ExperienceEnum;
}

export interface Header {
   title: string;
   description: string;
}

export interface ExploreData {
   header: Header;
   expertise: Expertise[];
   experience: Experience[];
}

export interface Testimonial {
   id: string;
   authorName: string;
   role: string;
   rating: number;
   comment: string;
   date: string;
}

export interface DetailedInterviewer extends Interviewer {
   testimonials: Testimonial[];
}