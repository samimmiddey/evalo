import { Telescope, ShieldCheck, Code2, Brain } from "lucide-react";
import { AboutDataTypes } from "./about.types";

export const aboutData: AboutDataTypes = {
   hero: {
      header: "The Evalo Mission",
      icon: Telescope,
      title: "Build Confidence Before the Real Interview",
      description:
         "Evalo was built to eliminate high-stakes guesswork from technical hiring. We connect engineers with vetted industry professionals for realistic 1-on-1 mock interviews, live collaborative coding, and structured rubric feedback.",
      primaryCta: {
         text: "Start Exploring",
         href: "/dashboard",
      },
      secondaryCta: {
         text: "View Pricing",
         href: "/pricing",
      },
      radarHub: {
         title: "EVALO",
      },
      satelliteNodes: [
         {
            id: "top",
            title: "MENTORS",
            icon: ShieldCheck,
            iconColor: "text-emerald-400",
            status: "100% Vetted Staff SWE",
            positionClass: "top-0 left-1/2 -translate-x-1/2",
            items: [
               { label: "Google" },
               { label: "Meta" },
               { label: "Stripe" },
               { label: "Amazon" },
            ],
         },
         {
            id: "bottom-left",
            title: "ENVIRONMENT",
            icon: Code2,
            iconColor: "text-emerald-400",
            status: "< 18ms WebRTC Stream",
            positionClass: "bottom-0 left-0 sm:left-1",
            items: [
               { label: "Python" },
               { label: "Go" },
               { label: "TypeScript" },
               { label: "C++" },
            ],
         },
         {
            id: "bottom-right",
            title: "EVALUATION",
            icon: Brain,
            iconColor: "text-emerald-400",
            status: "L5 / L6 Standardized",
            positionClass: "bottom-0 right-0 sm:right-1",
            items: [
               { label: "Architecture" },
               { label: "Algorithms" },
               { label: "Code" },
               { label: "Quality" },
            ],
         },
      ],
      pillars: [
         {
            number: "01",
            title: "Verified Industry Mentors",
            description:
               "Practice directly with senior and staff engineers from tier-1 companies who actively conduct real technical hiring screens.",
         },
         {
            number: "02",
            title: "Synchronized Code Runtime",
            description:
               "Experience authentic technical rounds with our built-in multi-language IDE, live code execution, and high-fidelity video calls.",
         },
         {
            number: "03",
            title: "Standardized Rubric Scoring",
            description:
               "Receive actionable, rubric-backed evaluation across problem breakdown, algorithmic efficiency, code quality, and communication.",
         },
      ],
   },
};
