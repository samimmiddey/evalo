import { LucideIcon } from "lucide-react";

// Hero Types
export interface ExploreHeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Features Types
export interface ExploreFeatureCard {
   icon: LucideIcon;
   title: string;
   description: string;
}

export interface ExploreFeatureDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   cards: ExploreFeatureCard[];
}

// CTA Types
export interface ExploreCTADataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
}

export interface ExploreDataTypes {
   hero: ExploreHeroDataTypes;
   features: ExploreFeatureDataTypes;
   cta: ExploreCTADataTypes;
}
