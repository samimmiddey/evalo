import { LucideIcon } from "lucide-react";

export interface DashboardActionButton {
   label: string;
   href: string;
}

export interface DashboardHeaderData {
   title: string;
   description: string;
   actionButton: DashboardActionButton;
}

export interface CandidateStatsData {
   total: {
      label: string;
      subtext: string;
   };
   scheduled: {
      label: string;
      subtext: string;
   };
   completed: {
      label: string;
      subtext: string;
   };
   successRate: {
      label: string;
      subtext: string;
   };
}

export interface InterviewerStatsData {
   total: {
      label: string;
   };
   scheduled: {
      label: string;
      subtext: string;
   };
   balance: {
      label: string;
   };
   rating: {
      label: string;
   };
}

export interface DashboardSessionCardData {
   title: string;
   viewAllHref: string;
   viewAllLabel: string;
   manageLabel: string;
   emptyTitle: string;
   emptyDescription: string;
}

export interface DashboardQuickAction {
   title: string;
   description: string;
   href: string;
   icon: LucideIcon;
   accent: string;
}

export interface CandidateDashboardData {
   header: DashboardHeaderData;
   stats: CandidateStatsData;
   sessionCard: DashboardSessionCardData;
   quickActions: DashboardQuickAction[];
}

export interface InterviewerDashboardData {
   header: DashboardHeaderData;
   stats: InterviewerStatsData;
   sessionCard: DashboardSessionCardData;
   quickActions: DashboardQuickAction[];
}

export interface DashboardDataStatic {
   candidate: CandidateDashboardData;
   interviewer: InterviewerDashboardData;
}

export type DashboardData = DashboardDataStatic;
