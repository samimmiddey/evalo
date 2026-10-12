import { ArrowLeft } from "lucide-react";
import { CheckoutData } from "./checkout.types";

export const checkoutData: CheckoutData = {
   header: {
      backButton: {
         title: "Back to Pricing",
         link: "/pricing",
         icon: ArrowLeft,
      },
      title: "Review & Checkout",
      description: "Verify your selected plan tier, monthly credit allowance, and billing breakdown before completing your order and activating your subscription",
   },
   planSummary: {
      popularBadge: "Most Popular",
      billingCycle: "Recurring monthly mandate",
      creditsNote: "Credits are added automatically each month and roll over while active",
      featuresHeading: "What's Included In Your Plan",
   },
   orderSummary: {
      title: "Order Summary",
      labels: {
         creditsQuota: "Monthly Credits Quota",
         taxesAndFees: "GST / Platform Fees",
         taxesStatus: "Included",
         totalDue: "Total Due Today",
         billingCadence: "Billed every month",
      },
      button: {
         text: "Proceed to Payment",
         loadingText: "Connecting...",
      },
      mandateDisclaimer: "Your recurring mandate will be authorized with Cashfree. You can cancel or pause the mandate anytime from your account settings.",
      securityBadge: "Secured by Cashfree Payments",
   },
};
