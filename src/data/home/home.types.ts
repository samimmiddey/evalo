import { LucideIcon } from "lucide-react";

// Hero Types
export interface HeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Features Types
export interface FeatureCard {
   icon: LucideIcon;
   title: string;
   description: string;
}

export interface FeatureDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   cards: FeatureCard[];
}

// Roles Types
export interface RoleCard {
   title: string;
   description: string;
   points: string[];
}

export interface RoleDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   interviewee: RoleCard;
   interviewer: RoleCard;
}

// Pricing Types
export interface PricingCard {
   title: string;
   price: string;
   description: string;
   credit: string;
   features: string[];
   isPopular?: boolean;
}

export interface PricingDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   plans: PricingCard[];
}

// Home Data Types
export interface HomeDataTypes {
   hero: HeroDataTypes;
   features: FeatureDataTypes;
   roles: RoleDataTypes;
   pricing: PricingDataTypes;
}