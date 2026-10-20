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
      tabLabel: "Payout Requests",
      emptyTitle: "No Payout Requests Yet",
      emptyDescription: "You haven't submitted any payout requests yet. All of your withdrawal records and transfer statuses will appear here."
   },
   transactionsTab: {
      tabLabel: "Credit Transactions",
      emptyTitle: "No Credit Transactions Yet",
      emptyDescription: "Your credit earnings from completed mock interview sessions, payout withdrawals, and adjustments will appear here.",
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
