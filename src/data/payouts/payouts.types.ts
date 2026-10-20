export interface PayoutsHeaderData {
   title: string;
   description: string;
}

export interface PayoutWalletCardData {
   title: string;
   availableLabel: string;
   singleAvailableLabel: string;
   buttonText: string;
   quickStats: {
      rateConversionLabel: string;
      rateConversionUnit: string;
      platformFeeLabel: string;
      platformFeeSubtext: string;
      netCashValueLabel: string;
   };
}

export interface PayoutHistoryTabData {
   tabLabel: string;
   emptyTitle: string;
   emptyDescription: string;
}

export interface PayoutTransactionsTabData {
   tabLabel: string;
   emptyTitle: string;
   emptyDescription: string;
   typeLabels: {
      bookingEarning: string;
      adminAdjustment: string;
      bookingRefund: string;
      bookingReversal: string;
   };
}

export interface RequestPayoutModalData {
   title: string;
   description: string;
   labels: {
      availableBalance: string;
      conversionRate: string;
      conversionRateUnit: string;
      platformFee: string;
      netPayoutAmount: string;
      creditsToWithdraw: string;
      maxButton: string;
   };
   buttons: {
      cancel: string;
      submit: string;
   };
}

export interface PayoutsDataStatic {
   header: PayoutsHeaderData;
   walletCard: PayoutWalletCardData;
   payoutsTab: PayoutHistoryTabData;
   transactionsTab: PayoutTransactionsTabData;
   requestModal: RequestPayoutModalData;
   noData: {
      title: string;
      body: string;
   };
}

export type PayoutsData = PayoutsDataStatic;
