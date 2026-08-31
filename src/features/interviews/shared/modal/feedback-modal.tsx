"use client";

import {
   CheckCircle2,
   AlertCircle,
   FileText,
   MessageSquare,
   Brain,
   Code,
   Target,
   Award
} from "lucide-react";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";

export interface SharedFeedback {
   id?: string;
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: string;
   sessionRating?: number | null;
   sessionComment?: string | null;
}

export interface FeedbackModalProps {
   open: boolean;
   onClose: () => void;
   feedback: SharedFeedback;
   candidateName?: string;
   title?: string;
   description?: string;
}

export const FeedbackModal = ({
   open,
   onClose,
   feedback,
   candidateName,
   title,
   description
}: FeedbackModalProps) => {
   const {
      summary,
      technical,
      communication,
      problemSolving,
      recommendation,
      strengths,
      improvements,
      overallRating
   } = feedback;

   const getOverallRatingStyle = (rating: string) => {
      switch (rating?.toUpperCase()) {
         case "EXCELLENT":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
         case "GOOD":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
         case "AVERAGE":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";
         case "POOR":
            return "bg-rose-500/10 text-rose-400 border-rose-500/20";
         default:
            return "bg-zinc-800 text-zinc-300 border-white/10";
      }
   };

   const getRecommendationStyle = (rec: string) => {
      const upper = rec?.toUpperCase() || "";
      if (upper.includes("HIRE") && !upper.includes("NO")) {
         return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      }
      if (upper.includes("CONSIDER")) {
         return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      }
      if (upper.includes("NO") || upper.includes("REJECT")) {
         return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      }
      return "bg-violet-500/10 text-violet-300 border-violet-500/20";
   };

   const modalTitle =
      title ||
      (candidateName
         ? `Session Feedback — ${candidateName}`
         : "Interview Evaluation Report");

   const modalDescription =
      description ||
      (candidateName
         ? "Review the AI-assisted performance breakdown, rubric scoring, and outcome recommendation."
         : "Complete performance breakdown and analysis from your interview session.");

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title={modalTitle}
         description={modalDescription}
         headerIcon={<FileText className="w-4 h-4 text-violet-400" />}
      >
         <div className="py-5 space-y-4 text-zinc-100 font-inter">
            {/* Top Overview Cards (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Overall Performance */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-violet-400 shrink-0" />
                        <SecondaryTitle
                           text="Overall Performance"
                           className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-zinc-400"
                        />
                     </div>
                     <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getOverallRatingStyle(
                           overallRating
                        )}`}
                     >
                        {overallRating || "N/A"}
                     </span>
                  </div>
                  <PrimaryBody
                     text="Automated evaluation status recorded for this mock interview session."
                     className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed"
                  />
               </div>

               {/* Hiring Recommendation */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-violet-400 shrink-0" />
                        <SecondaryTitle
                           text="Hiring Recommendation"
                           className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-zinc-400"
                        />
                     </div>
                     <span
                        className={`inline-flex items-center px-2 py-1.5 text-xs font-bold rounded-lg border ${getRecommendationStyle(
                           recommendation
                        )}`}
                     >
                        {recommendation || "Standard Evaluation"}
                     </span>
                  </div>
                  <PrimaryBody
                     text="Outcome decision derived from holistic session competencies."
                     className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed"
                  />
               </div>
            </div>

            {/* Executive Summary */}
            <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5">
               <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                  <SecondaryTitle
                     text="Executive Summary"
                     className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-zinc-300"
                  />
               </div>
               <PrimaryBody
                  text={summary || "No executive summary available for this session."}
                  className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed"
               />
            </div>

            {/* Core Competencies Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Technical Competency */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5 flex flex-col">
                  <div className="flex items-center gap-2">
                     <Code className="w-4 h-4 text-sky-400 shrink-0" />
                     <SecondaryTitle
                        text="Technical Competency"
                        className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-sky-400"
                     />
                  </div>
                  <PrimaryBody
                     text={technical || "No technical assessment documented."}
                     className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed mt-1 flex-1"
                  />
               </div>

               {/* Problem Solving */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5 flex flex-col">
                  <div className="flex items-center gap-2">
                     <Brain className="w-4 h-4 text-pink-400 shrink-0" />
                     <SecondaryTitle
                        text="Problem Solving"
                        className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-pink-400"
                     />
                  </div>
                  <PrimaryBody
                     text={problemSolving || "No problem solving assessment documented."}
                     className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed mt-1 flex-1"
                  />
               </div>

               {/* Communication */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5 flex flex-col">
                  <div className="flex items-center gap-2">
                     <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                     <SecondaryTitle
                        text="Communication & Clarity"
                        className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-emerald-400"
                     />
                  </div>
                  <PrimaryBody
                     text={communication || "No communication assessment documented."}
                     className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed mt-1 flex-1"
                  />
               </div>
            </div>

            {/* Strengths & Improvements Grid (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Key Strengths */}
               <div className="p-5 rounded-xl border border-emerald-500/15 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                     <SecondaryTitle
                        text="Key Strengths"
                        className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-emerald-400"
                     />
                  </div>
                  {strengths && strengths.length > 0 ? (
                     <ul className="space-y-2.5">
                        {strengths.map((item, idx) => (
                           <li
                              key={idx}
                              className="flex items-start gap-2.5"
                           >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.75 2xl:mt-2 shrink-0" />
                              <PrimaryBody
                                 text={item}
                                 className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed"
                              />
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <PrimaryBody
                        text="No key strengths documented."
                        className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-400! italic"
                     />
                  )}
               </div>

               {/* Areas for Improvement */}
               <div className="p-5 rounded-xl border border-amber-500/15 bg-amber-950/10 space-y-3">
                  <div className="flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                     <SecondaryTitle
                        text="Areas for Improvement"
                        className="text-xs! lg:text-xs! 2xl:text-sm! font-semibold uppercase tracking-wider text-amber-400"
                     />
                  </div>
                  {improvements && improvements.length > 0 ? (
                     <ul className="space-y-2.5">
                        {improvements.map((item, idx) => (
                           <li
                              key={idx}
                              className="flex items-start gap-2.5"
                           >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.75 2xl:mt-2 shrink-0" />
                              <PrimaryBody
                                 text={item}
                                 className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-300! leading-relaxed"
                              />
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <PrimaryBody
                        text="No improvements documented."
                        className="text-xs! lg:text-xs! 2xl:text-sm! text-zinc-400! italic"
                     />
                  )}
               </div>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default FeedbackModal;
