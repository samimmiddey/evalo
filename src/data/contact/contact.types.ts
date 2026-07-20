import { LucideIcon } from "lucide-react";

// Hero Types
export interface ContactHeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Form Types
export interface ContactFormDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
}

// FAQ Types
export interface FaqItem {
   question: string;
   answer: string;
}

export interface ContactFaqDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   items: FaqItem[];
}

// Root
export interface ContactDataTypes {
   hero: ContactHeroDataTypes;
   form: ContactFormDataTypes;
   faq: ContactFaqDataTypes;
}
