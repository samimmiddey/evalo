export interface BillingHeaderData {
   title: string;
   description: string;
}

export interface SubscriptionCardData {
   title: string;
   buttons: {
      upgrade: string;
      change: string;
      cancel: string;
   };
   statusBadges: {
      active: string;
      onHold: string;
      bankPending: string;
      cancelled: string;
   };
   quickStats: {
      recurringCostLabel: string;
      freeCostText: string;
      renewalDateLabel: string;
      renewsMonthlyText: string;
      noRenewalText: string;
      allowanceLabel: string;
      proAllowanceText: string;
      starterAllowanceText: string;
      freeAllowanceText: string;
   };
}

export interface CreditWalletCardData {
   title: string;
   description: string;
   availableLabel: string;
   singleAvailableLabel: string;
   usedLabel: string;
}

export interface TransactionsTabData {
   tabLabel: string;
   emptyTitle: string;
   emptyDescription: string;
   typeLabels: {
      creditPurchase: string;
      bookingDeductionDefault: string;
      bookingRefund: string;
      bookingReversal: string;
      adminAdjustment: string;
      viewAppointment: string;
   };
}

export interface InvoicesTabData {
   tabLabel: string;
   emptyTitle: string;
   subtext: string;
   statusBadges: {
      success: string;
      failed: string;
   };
}

export interface CancelModalData {
   title: string;
   description: string;
   confirmButton: string;
   successToast: string;
}

export interface PaymentRecoveryBannerData {
   title: string;
   body: string;
   buttonText: string;
}

export interface BillingDataStatic {
   header: BillingHeaderData;
   subscriptionCard: SubscriptionCardData;
   creditWalletCard: CreditWalletCardData;
   transactionsTab: TransactionsTabData;
   invoicesTab: InvoicesTabData;
   cancelModal: CancelModalData;
   paymentRecoveryBanner: PaymentRecoveryBannerData;
   noData: {
      title: string;
      body: string;
   };
}
