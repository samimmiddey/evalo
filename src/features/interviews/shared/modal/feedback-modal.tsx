"use client";

import {
   Star,
   CheckCircle2,
   AlertCircle,
   Sparkles,
   MessageSquare,
   Brain,
   Code,
   Quote
} from "lucide-react";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import PrimaryBody from "@/components/common/primary-body";

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
      overallRating,
      sessionRating,
      sessionComment
   } = feedback;

   const getOverallRatingStyle = (rating: string) => {
      switch (rating) {
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

   const modalTitle =
      title ||
      (candidateName
         ? `Session Feedback — ${candidateName}`
         : "Interview Evaluation Report");

   const modalDescription =
      description ||
      (candidateName
         ? "Review the AI-assisted performance breakdown, candidate review, and session assessment."
         : "Complete feedback and performance analysis from your mock interview session.");

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title={modalTitle}
         description={modalDescription}
      >
         <div className="py-5 space-y-6 text-zinc-100 font-inter">
            {/* Top Overview Cards: Rating, Score, Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Overall Performance Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                        Overall Performance
                     </span>
                     <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getOverallRatingStyle(
                           overallRating
                        )}`}
                     >
                        {overallRating}
                     </span>
                  </div>
                  <PrimaryBody
                     text="Determined based on comprehensive interview execution."
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                  />
               </div>

               {/* Session Rating Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                        {candidateName ? "Candidate Rating" : "Session Rating"}
                     </span>
                     <div className="flex items-center gap-1 mt-1">
                        {sessionRating ? (
                           <>
                              {Array.from({ length: 5 }).map((_, i) => (
                                 <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < sessionRating
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-zinc-700"
                                       }`}
                                 />
                              ))}
                              <span className="ml-2 text-sm font-bold text-zinc-200">
                                 {sessionRating}/5
                              </span>
                           </>
                        ) : (
                           <span className="text-xs text-zinc-500 italic">
                              No rating given
                           </span>
                        )}
                     </div>
                  </div>
                  <PrimaryBody
                     text={
                        candidateName
                           ? "Score provided by candidate."
                           : "Based on core rubrics and interview metrics."
                     }
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                  />
               </div>

               {/* Recommendation Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                        Recommendation
                     </span>
                     <span className="text-sm font-semibold text-zinc-200">
                        {recommendation || "Standard Evaluation"}
                     </span>
                  </div>
                  <PrimaryBody
                     text="Outcome recommendation based on assessment."
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                  />
               </div>
            </div>

            {/* Executive Summary */}
            <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2">
               <h5 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Executive Summary
               </h5>
               <PrimaryBody
                  text={summary}
                  className="text-sm! lg:text-sm! 2xl:text-sm! text-zinc-300! leading-relaxed"
               />
            </div>

            {/* Candidate / Interviewer Review Comment if any */}
            {sessionComment && (
               <div className="p-5 rounded-xl border border-violet-500/20 bg-violet-950/10 space-y-2">
                  <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
                     <Quote className="w-3.5 h-3.5" />
                     {candidateName ? "Candidate Review Comment" : "Interviewer Comment"}
                  </div>
                  <PrimaryBody
                     text={`“${sessionComment}”`}
                     className="text-sm! lg:text-sm! 2xl:text-sm! text-zinc-300! italic"
                  />
               </div>
            )}

            {/* Competency Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Technical Feedback */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                     <Code className="w-4 h-4" /> Technical Competency
                  </div>
                  <PrimaryBody
                     text={technical}
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-300! leading-relaxed"
                  />
               </div>

               {/* Problem Solving */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
                     <Brain className="w-4 h-4" /> Problem Solving
                  </div>
                  <PrimaryBody
                     text={problemSolving}
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-300! leading-relaxed"
                  />
               </div>

               {/* Communication */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/40 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                     <MessageSquare className="w-4 h-4" /> Communication
                  </div>
                  <PrimaryBody
                     text={communication}
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-300! leading-relaxed"
                  />
               </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Strengths */}
               <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-3">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                     <CheckCircle2 className="w-4 h-4" /> Key Strengths
                  </span>
                  {strengths && strengths.length > 0 ? (
                     <ul className="space-y-2">
                        {strengths.map((item, idx) => (
                           <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-zinc-300"
                           >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-xs text-zinc-400 italic">
                        No key strengths documented.
                     </p>
                  )}
               </div>

               {/* Improvements */}
               <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-3">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                     <AlertCircle className="w-4 h-4" /> Areas for Improvement
                  </span>
                  {improvements && improvements.length > 0 ? (
                     <ul className="space-y-2">
                        {improvements.map((item, idx) => (
                           <li
                              key={idx}
                              className="flex items-start gap-2 text-xs text-zinc-300"
                           >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <span>{item}</span>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-xs text-zinc-400 italic">
                        No improvements documented.
                     </p>
                  )}
               </div>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default FeedbackModal;
