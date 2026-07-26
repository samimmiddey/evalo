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
         value: 'INTERVIEWEE'
      },
      {
         icon: Briefcase,
         text: 'Interviewer',
         value: 'INTERVIEWER'
      }
   ],
   intervieweeTab: {
      selectedRoleBadge: {
         title: 'Interviewee',
         value: 'INTERVIEWER'
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
         value: 'INTERVIEWEE'
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
            name: 'experience',
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
            name: 'bio',
            label: 'Bio',
            placeholder: 'Write something about yourself',
            icon: Briefcase,
         },
      ]
   },
   formBtnText: 'Complete Setup',
   formBtnIcon: ArrowRight
};

export const defaultValues: OnboardingSchemaTypes = {
   role: 'INTERVIEWEE' as const,
   name: '',
   designation: '',
   company: '',
   experience: '',
   expertise: [],
   bio: ''
};

export const YEARS_OF_EXPERIENCE: YearsOfExperienceData[] = [
   { label: "Select Your Experience", value: "null" },
   { label: "1 year", value: "1" },
   { label: "2 years", value: "2" },
   { label: "3 years", value: "3" },
   { label: "4 years", value: "4" },
   { label: "5 years", value: "5" },
   { label: "6 years", value: "6" },
   { label: "7 years", value: "7" },
   { label: "8 years", value: "8" },
   { label: "9 years", value: "9" },
   { label: "10 years", value: "10" },
];

export const DOMAINS: DomainsData[] = [
   {
      name: 'Frontend',
      value: 'FRONTEND'
   },
   {
      name: 'Backend',
      value: 'BACKEND'
   },
   {
      name: 'Full Stack',
      value: 'FULLSTACK'
   },
   {
      name: 'DevOps',
      value: 'DEVOPS'
   },
   {
      name: 'DSA',
      value: 'DSA'
   },
   {
      name: 'System Design',
      value: 'SYSTEM_DESIGN'
   },
   {
      name: 'Mobile',
      value: 'MOBILE'
   },
   {
      name: 'ML / AI',
      value: 'ML_AI'
   },
   {
      name: 'Security',
      value: 'SECURITY'
   },
   {
      name: 'QA',
      value: 'QA'
   },
   {
      name: 'Cloud',
      value: 'CLOUD'
   },
];