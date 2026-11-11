import { PayoutsDataStatic } from "./payouts.types";

export const payoutsData: PayoutsDataStatic = {
   header: {
      title: "Earnings & Payouts",
      description: "Track your earned credit balance, view transaction history, and submit withdrawal requests."
   },
   walletCard: {
      title: "Credit Wallet Balance",
      availableLabel: "Credits",
      singleAvailableLabel: "Credit",
      buttonText: "Request Payout",
      quickStats: {
         rateConversionLabel: "Rate Conversion",
         rateConversionUnit: "/ Credit",
         platformFeeLabel: "Platform Service Fee",
         platformFeeSubtext: "on withdrawal",
         netCashValueLabel: "Est. Net Cash Value"
      }
   },
   payoutsTab: {
      tabLabel: "Payout Requests"
   },
   transactionsTab: {
      tabLabel: "Credit Transactions",
      typeLabels: {
         bookingEarning: "Session Earning",
         adminAdjustment: "Payout Withdrawal",
         bookingRefund: "Session Refund",
         bookingReversal: "Session Reversal"
      }
   },
   requestModal: {
      title: "Request Credit Payout",
      description: "Convert your earned interview credits to cash. Payouts are processed within 2-3 business days.",
      labels: {
         availableBalance: "Available Balance",
         conversionRate: "Conversion Rate",
         conversionRateUnit: "/ credit",
         platformFee: "Platform Fee",
         netPayoutAmount: "Net Payout Amount",
         creditsToWithdraw: "Credits to Withdraw",
         maxButton: "Max"
      },
      buttons: {
         cancel: "Cancel",
         submit: "Submit Request"
      }
   },
   noData: {
      title: "Payout Details Unavailable",
      body: "Unable to load your credit wallet and conversion rates at this time."
   }
};
