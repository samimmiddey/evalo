import { LucideIcon } from "lucide-react";

// Hero Types
export interface HeroDataTypes {
   header: string;
   title: string;
   description: string;
}

// Features Types
export interface FeatureThemeConfig {
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

export interface FeatureCard {
   icon: LucideIcon;
   tag: string;
   title: string;
   description: string;
   theme: FeatureThemeConfig;
}

export interface FeatureDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   cards: FeatureCard[];
}

// Roles Types (Two-Card Design)
export interface RoleTheme {
   gradient: string;
   glow: string;
   border: string;
   hoverBorder: string;
   topShimmer: string;
   iconBg: string;
   iconBorder: string;
   iconText: string;
   badgeText: string;
   dotBg: string;
   checkBg: string;
   checkBorder: string;
   checkColor: string;
   arrowHover: string;
   shadow: string;
   buttonClass: string;
}

export interface RoleCard {
   icon: LucideIcon;
   tag: string;
   trackLabel: string;
   statusLabel: string;
   index: string;
   title: string;
   description: string;
   workflowTitle?: string;
   points: string[];
   cta: {
      text: string;
      href: string;
   };
   theme: RoleTheme;
}

export interface RoleDataTypes {
   icon: LucideIcon;
   header: string;
   title: string;
   description: string;
   candidate: RoleCard;
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