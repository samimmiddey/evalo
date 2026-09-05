import {
   Calendar,
   Clock,
   Compass,
   SlidersHorizontal,
   Wallet
} from "lucide-react";
import { InterviewerDashboardData } from "./dashboard.types";

export const dashboardData = {
   interviewee: {
      header: {
         title: "Overview",
         description: "Track your mock interview progress, upcoming sessions, and review your performance breakdown."
      },
      statsLabels: {
         total: "Total Interviews",
         scheduled: "Upcoming",
         completed: "Completed",
         successRate: "Success Rate"
      },
      quickActions: [
         {
            title: "Explore Interviewers",
            description: "Browse verified engineering leaders and schedule technical mock sessions.",
            href: "/dashboard/interviewers",
            icon: Compass,
            accent: "violet"
         },
         {
            title: "View Appointments",
            description: "Check your booking schedule, access call rooms, and review AI feedback.",
            href: "/dashboard/appointments",
            icon: Calendar,
            accent: "blue"
         }
      ]
   },
   interviewer: {
      header: {
         title: "Interviewer Overview",
         description: "Manage your sessions, configure booking slots, and track credit earnings and reviews."
      },
      statsLabels: {
         total: "Total Sessions",
         scheduled: "Upcoming",
         balance: "Credit Balance",
         rating: "Average Rating"
      },
      quickActions: [
         {
            title: "Manage Availability",
            description: "Set your weekly recurring time slots so interviewees can book sessions.",
            href: "/dashboard/availability",
            icon: Clock,
            accent: "violet"
         },
         {
            title: "Earnings & Payouts",
            description: "Review credit transactions, wallet history, and request bank payouts.",
            href: "/dashboard/payouts",
            icon: Wallet,
            accent: "emerald"
         },
         {
            title: "Profile & Domains",
            description: "Keep your bio, years of experience, and interview domains up to date.",
            href: "/dashboard/settings",
            icon: SlidersHorizontal,
            accent: "blue"
         }
      ]
   }
};

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
   profile: {
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
