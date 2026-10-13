import { OnboardingSchemaTypes } from "@/features/onboarding/schemas/onboarding.schemas";
import { ArrowRight, Briefcase, ShieldCheck, Flame, User, Zap, Brain, Phone } from "lucide-react";
import { DomainsData, OnboardingData, YearsOfExperienceData } from "./onboardiong.types";

export const onboardingData: OnboardingData = {
   header: {
      btnText: 'Onboarding',
      btnIcon: User,
      title: 'Setup Your Profile',
      description: "We'd love to get to know you. Take a quick moment to tell us about yourself so we can personalize your experience.",
   },
   tabs: [
      {
         icon: User,
         text: 'Candidate',
         value: 'CANDIDATE'
      },
      {
         icon: Briefcase,
         text: 'Interviewer',
         value: 'INTERVIEWER'
      }
   ],
   candidateTab: {
      contextCard: {
         icon: Flame,
         title: 'Candidate Experience',
         description: 'Everything you need to practice and stand out',
         list: [
            {
               icon: Brain,
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
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Enter your first name',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'phone',
            label: 'Phone Number',
            placeholder: 'Enter your 10-digit phone number',
            icon: Phone,
         }
      ]
   },
   interviewerTab: {
      formFields: [
         {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Enter your first name',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'designation',
            label: 'Designation',
            placeholder: 'Enter your designation',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'company',
            label: 'Company',
            placeholder: 'Enter your company',
            icon: Briefcase,
         },
         {
            type: 'select',
            name: 'experience',
            label: 'Years of Experience',
            placeholder: 'Enter your years of experience',
            icon: Briefcase,
         },
         {
            type: 'chips',
            name: 'expertise',
            label: 'Expertise',
            placeholder: 'Enter your expertise',
            icon: Briefcase,
         },
         {
            type: 'text',
            name: 'phone',
            label: 'Phone Number',
            placeholder: 'Enter your 10-digit phone number',
            icon: Phone,
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
   role: 'CANDIDATE' as const,
   firstName: '',
   lastName: '',
   designation: '',
   company: '',
   experience: '',
   expertise: [],
   bio: '',
   phone: ''
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
      label: 'Frontend',
      value: 'FRONTEND'
   },
   {
      label: 'Backend',
      value: 'BACKEND'
   },
   {
      label: 'Full Stack',
      value: 'FULLSTACK'
   },
   {
      label: 'DevOps',
      value: 'DEVOPS'
   },
   {
      label: 'DSA',
      value: 'DSA'
   },
   {
      label: 'System Design',
      value: 'SYSTEM_DESIGN'
   },
   {
      label: 'Mobile',
      value: 'MOBILE'
   },
   {
      label: 'ML / AI',
      value: 'ML_AI'
   },
   {
      label: 'Security',
      value: 'SECURITY'
   },
   {
      label: 'QA',
      value: 'QA'
   },
   {
      label: 'Cloud',
      value: 'CLOUD'
   },
];