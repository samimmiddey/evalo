export interface DashboardSectionHeader {
   title: string;
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

export interface InterviewerDashboardData {
   sessions: DashboardSectionHeader;
   availability: DashboardSectionHeader;
   payouts: DashboardSectionHeader;
   profile: DashboardSectionHeader;
   payout: DashboardPayoutConfig;
   slotPresets: SlotPreset[];
}
