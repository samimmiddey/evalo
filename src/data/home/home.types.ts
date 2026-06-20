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

export interface HomeDataTypes {
   hero: HeroDataTypes;
   features: FeatureDataTypes;
   roles: RoleDataTypes;
}