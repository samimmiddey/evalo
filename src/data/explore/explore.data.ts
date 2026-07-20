import { ExploreDataTypes } from "./explore.types";
import {
   Search,
   Users,
   CalendarCheck,
   Star,
   ShieldCheck,
   Telescope,
   Rocket,
} from "lucide-react";

export const exploreData: ExploreDataTypes = {
   hero: {
      header: "Browse. Filter. Book.",
      title: "Find your perfect interview expert",
      description:
         "Search through a curated pool of vetted industry professionals. Filter by company, role, or specialty and book a session that fits your schedule.",
   },
   features: {
      icon: Telescope,
      header: "How Explore Works",
      title: "Everything you need to find the right match",
      description:
         "Powerful search and discovery tools to help you connect with the right expert for your specific goals.",
      cards: [
         {
            icon: Search,
            title: "Smart Search & Filters",
            description:
               "Narrow down thousands of experts by target company, tech stack, experience level, or interview type. The right match is always just a few clicks away.",
         },
         {
            icon: Users,
            title: "Verified Expert Profiles",
            description:
               "Every interviewer on the platform has a detailed profile showcasing their industry background, companies they've worked at, and the skills they evaluate.",
         },
         {
            icon: Star,
            title: "Ratings & Reviews",
            description:
               "Make informed decisions using genuine candidate reviews and session ratings, so you always know who you're booking before you commit.",
         },
         {
            icon: CalendarCheck,
            title: "Real-Time Availability",
            description:
               "See live slot availability for each expert and book sessions instantly without any back-and-forth. Block a time that works for you in seconds.",
         },
         {
            icon: ShieldCheck,
            title: "Trusted & Vetted",
            description:
               "All interviewers go through a quality review process before being listed. You get access to qualified professionals who are serious about helping candidates grow.",
         },
      ],
   },
   cta: {
      icon: Rocket,
      header: "Ready to Explore",
      title: "Your next opportunity is one search away",
      description:
         "Start browsing today and connect with an expert who can help you crack the interview, land the role, and take your career to the next level.",
   },
};
