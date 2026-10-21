import { Interviewer } from "@/features/interviews/shared/types/shared.types";
import { LucideIcon } from "lucide-react";



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

export interface SectionHeader {
   title: string;
   description: string;
}

export interface SlotPreset {
   label: string;
   start: string;
   end: string;
}

export interface InterviewerData {
   sessions: SectionHeader;
   availability: SectionHeader;
   profile: SectionHeader;
   slotPresets: SlotPreset[];
}