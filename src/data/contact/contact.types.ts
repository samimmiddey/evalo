import { LucideIcon } from "lucide-react";

// Hero Types
export interface ContactHeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Channel Card Types
export interface ContactChannelTheme {
   gradient: string;
   glow: string;
   border: string;
   hoverBorder: string;
   topShimmer: string;
   iconBg: string;
   iconText: string;
   iconBorder: string;
   dotBg: string;
   badgeText: string;
   arrowHover: string;
   shadow: string;
}

export interface ContactChannel {
   icon: LucideIcon;
   tag: string;
   title: string;
   desc: string;
   href: string | null;
   isLink: boolean;
   theme: ContactChannelTheme;
}

// Form Types
export interface ContactFormDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   formTitle: string;
   formDescription: string;
   channels: ContactChannel[];
   subjects: string[];
   metaBadges: {
      replyTime: string;
      security: string;
   };
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
