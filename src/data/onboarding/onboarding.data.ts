import { OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";
import { ArrowRight, Briefcase, ShieldCheck, Sparkles, User, Zap } from "lucide-react";
import { DomainsData, OnboardingData, YearsOfExperienceData } from "./onboardiong.types";

export const onboardingData: OnboardingData = {
   header: {
      btnText: 'Profile',
      btnIcon: User,
      title: 'Setup Your Profile',
      description: "We'd love to get to know you. Tell us a little about yourself so we can personalize your experience.",
   },
   tabs: [
      {
         icon: User,
         text: 'Interviewee',
         value: 'interviewee'
      },
      {
         icon: Briefcase,
         text: 'Interviewer',
         value: 'interviewer'
      }
   ],
   intervieweeTab: {
      selectedRoleBadge: {
         title: 'Interviewee',
         value: 'interviewer'
      },
      contextCard: {
         icon: Sparkles,
         title: 'Interviewee Experience',
         description: 'Everything you need to practice and stand out',
         list: [
            {
               icon: Sparkles,
               title: 'AI-powered interactive mock technical interviews',
            },
            {
               icon: Zap,
               title: 'Real-time feedback & instant candidate skill analytics',
            },
            {
               icon: ShieldCheck,
               title: 'Direct candidate profile visibility for hiring managers',
            },
         ]
      },
      formFields: [
         {
            type: 'text',
            name: 'name',
            label: 'Full Name',
            placeholder: 'Enter Your Full Name',
            icon: Briefcase,
         }
      ]
   },
   interviewerTab: {
      selectedRoleBadge: {
         title: 'Interviewer',
         value: 'interviewee'
      },
      formFields: [
         {
            type: 'text',
            name: 'name',
            label: 'Full Name',
            placeholder: 'Enter Your Full Name',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'designation',
            label: 'Designation',
            placeholder: 'Enter Your Designation',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'company',
            label: 'Company',
            placeholder: 'Enter Your Company',
            icon: Briefcase,
         },
         {
            type: 'select',
            name: 'yoe',
            label: 'Years of Experience',
            placeholder: 'Enter Your Years of Experience',
            icon: Briefcase,
         },
         {
            type: 'chips',
            name: 'expertise',
            label: 'Expertise',
            placeholder: 'Enter Your Expertise',
            icon: Briefcase,
         },
         {
            type: 'textarea',
            name: 'about',
            label: 'About Me',
            placeholder: 'Enter Your About Me',
            icon: Briefcase,
         },
      ]
   },
   formBtnText: 'Go to Dashboard',
   formBtnIcon: ArrowRight
};

export const defaultValues: OnboardingSchemaTypes = {
   role: 'interviewee' as const,
   name: '',
   designation: '',
   company: '',
   yoe: '',
   expertise: '',
   about: ''
};

export const YEARS_OF_EXPERIENCE: YearsOfExperienceData[] = [
   { label: "Select Your Experience", value: "null" },
   { label: "1 year", value: "1 year" },
   { label: "2 years", value: "2 years" },
   { label: "3 years", value: "3 years" },
   { label: "4 years", value: "4 years" },
   { label: "5 years", value: "5 years" },
   { label: "6 years", value: "6 years" },
   { label: "7 years", value: "7 years" },
   { label: "8 years", value: "8 years" },
   { label: "9 years", value: "9 years" },
   { label: "10+ years", value: "10+ years" },
];

export const DOMAINS: DomainsData = [
   'Frontend', 'Backend', 'Full Stack', 'DevOps',
   'Mobile', 'Data Science', 'ML / AI', 'Security', 'QA', 'Cloud',
];