import { Calendar, Clock, Compass, SlidersHorizontal, Wallet } from "lucide-react";
import { DashboardDataStatic } from "./dashboard.types";

export const dashboardData: DashboardDataStatic = {
   candidate: {
      header: {
         title: "Overview",
         description: "Track your mock interview metrics, upcoming sessions, and review structured feedback from verified engineers.",
         actionButton: {
            label: "Explore Interviewers",
            href: "/dashboard/interviewers"
         }
      },
      stats: {
         total: {
            label: "Total Interviews",
            subtext: "All booked sessions"
         },
         scheduled: {
            label: "Upcoming",
            subtext: "Scheduled on calendar"
         },
         completed: {
            label: "Completed",
            subtext: "With AI feedback"
         },
         successRate: {
            label: "Success Rate",
            subtext: "Completion benchmark"
         }
      },
      sessionCard: {
         title: "Upcoming Interviews",
         viewAllHref: "/dashboard/appointments",
         viewAllLabel: "View all appointments",
         manageLabel: "Manage Booking",
         emptyTitle: "No Upcoming Interviews",
         emptyDescription: "Ready to practice? Connect with engineering leaders for mock coding and system design rounds."
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
         description: "Monitor your mock interview schedule, manage slot bookings, and track credit earnings and candidate reviews.",
         actionButton: {
            label: "Configure Slots",
            href: "/dashboard/availability"
         }
      },
      stats: {
         total: {
            label: "Total Sessions"
         },
         scheduled: {
            label: "Upcoming",
            subtext: "On calendar schedule"
         },
         balance: {
            label: "Credit Balance"
         },
         rating: {
            label: "Rating"
         }
      },
      sessionCard: {
         title: "Upcoming Sessions",
         viewAllHref: "/dashboard/sessions",
         viewAllLabel: "View all sessions",
         manageLabel: "Manage Session",
         emptyTitle: "No Scheduled Sessions",
         emptyDescription: "Keep your calendar up to date by configuring availability slots for candidates to book."
      },
      quickActions: [
         {
            title: "Manage Availability",
            description: "Set your weekly recurring time slots so candidates can book sessions.",
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
            href: "/dashboard/profile",
            icon: SlidersHorizontal,
            accent: "blue"
         }
      ]
   }
};
