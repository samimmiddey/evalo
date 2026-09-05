import { Interviewer } from "@/features/interviews/shared/types/shared.types";
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

export interface SectionHeader {
   title: string;
   description: string;
}

export interface PaymentMethodOption {
   value: string;
   label: string;
}

export interface PayoutConfig {
   ratePerCredit: number;
   platformFeePercent: number;
   minCredits: number;
   paymentMethods: PaymentMethodOption[];
}

export interface SlotPreset {
   label: string;
   start: string;
   end: string;
}

export interface InterviewerData {
   sessions: SectionHeader;
   availability: SectionHeader;
   payouts: SectionHeader;
   profile: SectionHeader;
   payout: PayoutConfig;
   slotPresets: SlotPreset[];
}

export interface DashboardHeader {
   title: string;
   description: string;
}

export interface IntervieweeStatsLabels {
   total: string;
   scheduled: string;
   completed: string;
   successRate: string;
}

export interface InterviewerStatsLabels {
   total: string;
   scheduled: string;
   balance: string;
   rating: string;
}

export interface DashboardQuickAction {
   title: string;
   description: string;
   href: string;
   icon: LucideIcon;
   accent: string;
}

export interface IntervieweeDashboardConfig {
   header: DashboardHeader;
   statsLabels: IntervieweeStatsLabels;
   quickActions: DashboardQuickAction[];
}

export interface InterviewerDashboardConfig {
   header: DashboardHeader;
   statsLabels: InterviewerStatsLabels;
   quickActions: DashboardQuickAction[];
}

export interface DashboardData {
   interviewee: IntervieweeDashboardConfig;
   interviewer: InterviewerDashboardConfig;
}