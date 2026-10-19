import { PLAN_CREDITS } from "@/types/user.types";
import { BillingDataStatic } from "./billing.types";

export const billingData: BillingDataStatic = {
   header: {
      title: "Billing & Credits",
      description:
         "Manage your subscription, track your credit allocation and usage, and review your payment receipts and billing history."
   },
   subscriptionCard: {
      title: "Current Subscription",
      buttons: {
         upgrade: "Upgrade Plan",
         change: "Change Plan",
         cancel: "Cancel"
      },
      statusBadges: {
         active: "Active",
         onHold: "Payment On Hold",
         bankPending: "Bank Pending",
         cancelled: "Cancelled"
      },
      quickStats: {
         recurringCostLabel: "Recurring Cost",
         freeCostText: "Free of charge",
         renewalDateLabel: "Billing Renewal",
         renewsMonthlyText: "Renews Monthly",
         noRenewalText: "No renewal scheduled",
         allowanceLabel: "Monthly Allowance",
         proAllowanceText: `${PLAN_CREDITS.pro} Credits / month`,
         starterAllowanceText: `${PLAN_CREDITS.starter} Credits / month`,
         freeAllowanceText: `${PLAN_CREDITS.free} ${PLAN_CREDITS.free === 1 ? "Credit" : "Credits"} / month`
      }
   },
   creditWalletCard: {
      title: "Available Balance",
      description: "Available to book mock interviews",
      availableLabel: "Credits Available",
      singleAvailableLabel: "Credit Available",
      usedLabel: "Used This Period"
   },
   transactionsTab: {
      tabLabel: "Credit Transactions",
      emptyTitle: "No Credit Transactions Yet",
      emptyDescription: "Your mock interview credit grants, booking deductions, and session refunds will appear here.",
      typeLabels: {
         creditPurchase: "Subscription Credit Grant",
         bookingDeductionDefault: "Mock Interview Booking",
         bookingRefund: "Session Refund",
         bookingReversal: "Session Reversal",
         adminAdjustment: "Administrative Adjustment",
         viewAppointment: "View Appointment"
      }
   },
   invoicesTab: {
      tabLabel: "Invoices & Payments",
      emptyTitle: "No payment invoice records found yet.",
      subtext: "Auto-billed by Cashfree",
      statusBadges: {
         success: "Successful",
         failed: "Failed"
      }
   },
   cancelModal: {
      title: "Cancel Subscription",
      description:
         "Are you sure you want to cancel your subscription? Your remaining interview credits will remain in your balance.",
      confirmButton: "Cancel Subscription",
      successToast: "Subscription has been cancelled."
   },
   paymentRecoveryBanner: {
      title: "Subscription payment on hold",
      body: "Your latest renewal payment failed. Complete payment to keep your interview credits and plan active.",
      buttonText: "Fix Payment"
   },
   noData: {
      title: "Billing Details Unavailable",
      body: "Unable to retrieve your subscription or transaction records at this time."
   }
};
