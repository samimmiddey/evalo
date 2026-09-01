import { InterviewerDashboardData } from "./interviewer-dashboard.types";

export const interviewerDashboardData: InterviewerDashboardData = {
   sessions: {
      title: "Sessions",
      description: "Manage and review your upcoming mock interviews and review completed session feedback."
   },
   availability: {
      title: "Availability",
      description: "Set your weekly recurring time slots so candidates can book mock interview sessions with you."
   },
   payouts: {
      title: "Earnings & Payouts",
      description: "Track your earned credit balance, view transaction history, and submit withdrawal requests."
   },
   settings: {
      title: "Profile Settings",
      description: "Update your bio, current company, designation, years of experience, and interview domains."
   },
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
