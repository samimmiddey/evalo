import {
   Clock,
   SlidersHorizontal,
   Video,
   Wallet
} from "lucide-react";
import { DashboardData } from "./dashboard.types";

export const dashboardData: DashboardData = {
   header: {
      title: "Dashboard",
      description: "Manage your upcoming mock sessions, set your availability slots, track credit earnings, and request payouts."
   },
   tabs: [
      {
         id: "sessions",
         label: "Sessions",
         icon: Video,
         description: "Upcoming and past interview sessions"
      },
      {
         id: "availability",
         label: "Availability",
         icon: Clock,
         description: "Configure available slots for bookings"
      },
      {
         id: "payouts",
         label: "Earnings & Payouts",
         icon: Wallet,
         description: "Credit wallet, transactions, and withdrawals"
      },
      {
         id: "settings",
         label: "Profile",
         icon: SlidersHorizontal,
         description: "Bio, expertise domains, and session rate"
      }
   ],
   payout: {
      ratePerCredit: 25, // $25 per credit
      platformFeePercent: 10, // 10% platform fee
      minCredits: 1,
      paymentMethods: [
         { value: "BANK_TRANSFER", label: "Direct Bank Transfer" },
         { value: "PAYPAL", label: "PayPal" },
         { value: "UPI", label: "UPI / Virtual Payment Address" }
      ]
   },
   slotPresets: [
      { label: "Morning (09:00 AM - 12:00 PM)", start: "09:00", end: "12:00" },
      { label: "Afternoon (02:00 PM - 05:00 PM)", start: "14:00", end: "17:00" },
      { label: "Evening (06:00 PM - 09:00 PM)", start: "18:00", end: "21:00" }
   ]
};
