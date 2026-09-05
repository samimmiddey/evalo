import { Interviewer } from "@/features/interviews/shared/types/interviewers.shared.types";
import { LucideIcon } from "lucide-react";

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

export interface InterviewsData {
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

export interface WhatToExpect {
   header: {
      title: string;
      icon: LucideIcon;
   };
}

export interface DetailedInterviewer extends Omit<Interviewer, 'creditRate'> {
   testimonials: Testimonial[];
}

export interface CardHeader {
   title: string;
   icon: LucideIcon;
}

export interface InterviewerDetails {
   backBtn: CardHeader;
   creditRate: number;
   bio: CardHeader;
   testimonial: CardHeader;
   booking: CardHeader;
   whatToExpect: WhatToExpect;
   interviewers: DetailedInterviewer[];
}