import { HomeDataTypes } from "./home.types";
import { Video, BrainCircuit, Library, LineChart, CalendarClock } from 'lucide-react'

export const homeData: HomeDataTypes = {
   hero: {
      header: "Go beyond the surface to evaluate true potential",
      title: "Ace your next interview with real experts",
      description: "Get matched with experts for one-on-one mock interviews that go beyond generic advice. Receive personalized feedback and gain the confidence you need to succeed."
   },
   features: [
      {
         icon: Video,
         title: "Live Interview Sessions & Persistent Chat",
         description:
            "Connect with interviewers through smooth HD video calls and persistent chat that keeps your entire conversation history, shared context, and discussion flow in one place, making it easy to revisit decisions, clarify doubts, and stay aligned throughout the interview process.",
      },
      {
         icon: BrainCircuit,
         title: "AI-Assisted Performance Evaluation",
         description:
            "Receive instant, objective feedback on your solutions with insights on code quality, complexity, and adherence to best practices to help you improve faster.",
      },
      {
         icon: Library,
         title: "Flexible Credit-Based Access",
         description:
            "Subscribe to monthly credits, book interview sessions instantly, and manage usage easily while interviewers can earn credits and withdraw their earnings anytime.",
      },
      {
         icon: LineChart,
         title: "Detailed Performance Reports",
         description:
            "Track your progress over time with in-depth analytics that highlight strengths, weaknesses, and actionable areas for improvement.",
      },
      {
         icon: CalendarClock,
         title: "Slot-Based Scheduling",
         description:
            "Easily book and manage interview sessions using flexible time slots, allowing candidates and interviewers to coordinate availability seamlessly without conflicts.",
      }
   ]
}