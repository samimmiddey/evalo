import { LucideIcon } from "lucide-react";

export interface HeroDataTypes {
   header: string
   title: string
   description: string
}

export interface FeatureDataTypes {
   icon: LucideIcon;
   title: string;
   description: string;
}

export interface HomeDataTypes {
   hero: HeroDataTypes;
   features: FeatureDataTypes[];
}