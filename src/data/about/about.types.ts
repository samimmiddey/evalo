import { LucideIcon } from "lucide-react";

// Hero Types
export interface AboutHeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Features Types
export interface AboutFeatureCard {
   icon: LucideIcon;
   title: string;
   description: string;
}

export interface AboutFeatureDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   cards: AboutFeatureCard[];
}

// CTA Types
export interface AboutCTADataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
}

export interface AboutDataTypes {
   hero: AboutHeroDataTypes;
   features: AboutFeatureDataTypes;
   cta: AboutCTADataTypes;
}
