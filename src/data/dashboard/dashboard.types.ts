import { LucideIcon } from "lucide-react";
import { DashboardTabType } from "@/features/interviews/dashboard/types/dashboard.types";

export interface DashboardHeaderData {
   title: string;
   description: string;
}

export interface DashboardTabData {
   id: DashboardTabType;
   label: string;
   icon: LucideIcon;
   description: string;
}

export interface PaymentMethodOption {
   value: string;
   label: string;
}

export interface DashboardPayoutConfig {
   ratePerCredit: number;
   platformFeePercent: number;
   minCredits: number;
   paymentMethods: PaymentMethodOption[];
}

export interface SlotPreset {
   label: string;
   start: string;
   end: string;
}

export interface DashboardData {
   header: DashboardHeaderData;
   tabs: DashboardTabData[];
   payout: DashboardPayoutConfig;
   slotPresets: SlotPreset[];
}
