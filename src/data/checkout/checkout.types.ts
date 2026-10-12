import { LucideIcon } from "lucide-react";

export interface CheckoutHeaderData {
   backButton: {
      title: string;
      link: string;
      icon: LucideIcon;
   };
   title: string;
   description: string;
}

export interface PlanSummaryData {
   popularBadge: string;
   billingCycle: string;
   creditsNote: string;
   featuresHeading: string;
}

export interface OrderSummaryLabels {
   creditsQuota: string;
   taxesAndFees: string;
   taxesStatus: string;
   totalDue: string;
   billingCadence: string;
}

export interface OrderSummaryButton {
   text: string;
   loadingText: string;
}

export interface OrderSummaryData {
   title: string;
   labels: OrderSummaryLabels;
   button: OrderSummaryButton;
   mandateDisclaimer: string;
   securityBadge: string;
}

export interface CheckoutData {
   header: CheckoutHeaderData;
   planSummary: PlanSummaryData;
   orderSummary: OrderSummaryData;
}
