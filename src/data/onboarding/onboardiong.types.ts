import { LucideIcon } from "lucide-react";

export interface HeaderData {
   btnText: string;
   btnIcon: LucideIcon;
   title: string;
   description: string;
}

export interface Tabs {
   icon: LucideIcon;
   text: string;
   value: string;
}

export interface FormFields {
   type: string;
   name: string;
   label: string;
   placeholder: string;
   icon: LucideIcon;
}

export interface IntervieweeTab {
   selectedRoleBadge: {
      title: string;
      value: string;
   };
   contextCard: {
      icon: LucideIcon;
      title: string;
      description: string;
      list: {
         icon: LucideIcon;
         title: string;
      }[];
   };
   formFields: FormFields[];
}

export interface InterviewerTab {
   selectedRoleBadge: {
      title: string;
      value: string;
   };
   formFields: FormFields[];
}

export interface OnboardingData {
   header: HeaderData;
   tabs: Tabs[];
   intervieweeTab: IntervieweeTab;
   interviewerTab: InterviewerTab;
   formBtnText: string;
   formBtnIcon: LucideIcon;
}

export interface YearsOfExperienceData {
   label: string;
   value: string;
}

export type DomainValue = 'FRONTEND' | 'BACKEND' | 'FULLSTACK' | 'DEVOPS' | 'DSA' | 'SYSTEM_DESIGN' | 'MOBILE' | 'ML_AI' | 'SECURITY' | 'QA' | 'CLOUD';

export interface DomainsData {
   label: string;
   value: DomainValue;
};