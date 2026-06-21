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

// Testimonial Types
export interface TestimonialCard {
   name: string;
   role: string;
   review: string;
   avatar: string;
}

export interface TestimonialDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   reviews: TestimonialCard[];
}

// CTA Types
export interface CTADataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
}

export interface HomeDataTypes {
   hero: HeroDataTypes;
   features: FeatureDataTypes;
   roles: RoleDataTypes;
   pricing: PricingDataTypes;
   testimonials: TestimonialDataTypes;
   cta: CTADataTypes;
}