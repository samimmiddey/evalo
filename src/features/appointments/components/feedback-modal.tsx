'use client';

import { Star, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Award, Brain, Code, Quote } from 'lucide-react';
import { Feedback } from '../types/appointments.types';
import ModalWrapper from '@/components/wrappers/modal-wrapper';

interface FeedbackModalProps {
   open: boolean;
   onClose: () => void;
   feedback: Feedback;
}

export const FeedbackModal = ({ open, onClose, feedback }: FeedbackModalProps) => {
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

   const getOverallRatingStyle = (rating: typeof overallRating) => {
      switch (rating) {
         case 'EXCELLENT':
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
         case 'GOOD':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
         case 'AVERAGE':
            return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
         case 'POOR':
            return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
         default:
            return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      }
   };

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title="Interview Evaluation Report"
         description="Complete feedback and performance analysis from your mock interview session."
      >
         <div className="py-6 space-y-6 text-zinc-100 font-inter">
            {/* Top Stats / Ratings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Overall Performance Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                        Overall Performance
                     </span>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${getOverallRatingStyle(overallRating)}`}>
                        {overallRating}
                     </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                     Determined by the interviewer based on overall execution.
                  </p>
               </div>

               {/* Session Rating Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-3">
                  <div>
                     <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                        Session Rating
                     </span>
                     <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Star
                              key={i}
                              className={`w-5 h-5 ${i < (sessionRating ?? 0)
                                    ? 'fill-amber-500 text-amber-500'
                                    : 'text-zinc-700'
                                 }`}
                           />
                        ))}
                        <span className="text-sm font-bold ml-2 font-outfit text-zinc-300">
                           {sessionRating ?? 0} / 5
                        </span>
                     </div>
                  </div>
                  <p className="text-xs text-zinc-400">
                     Based on core rubrics and interview metrics.
                  </p>
               </div>

               {/* Session Comment Card */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/50 flex flex-col justify-between gap-2 md:col-span-1">
                  <div className="flex items-start gap-2">
                     <Quote className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                     <div className="min-w-0">
                        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block mb-1">
                           Interviewer Comment
                        </span>
                        <p className="text-sm italic text-zinc-300 line-clamp-3">
                           &quot;{sessionComment || 'No comment provided.'}&quot;
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Summary */}
            <div className="p-6 rounded-xl border border-white/5 bg-zinc-900/30">
               <h5 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-2 font-outfit flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Executive Summary
               </h5>
               <p className="text-sm text-zinc-300 leading-relaxed">
                  {summary}
               </p>
            </div>

            {/* Core Competencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Technical Feedback */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/30 space-y-2.5">
                  <h5 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <Code className="w-4 h-4 text-sky-400" />
                     Technical Feedback
                  </h5>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                     {technical}
                  </p>
               </div>

               {/* Problem Solving */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/30 space-y-2.5">
                  <h5 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <Brain className="w-4 h-4 text-pink-400" />
                     Problem Solving
                  </h5>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                     {problemSolving}
                  </p>
               </div>

               {/* Communication */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/30 space-y-2.5">
                  <h5 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <MessageSquare className="w-4 h-4 text-emerald-400" />
                     Communication
                  </h5>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                     {communication}
                  </p>
               </div>

               {/* Recommendation */}
               <div className="p-5 rounded-xl border border-white/5 bg-zinc-900/30 space-y-2.5">
                  <h5 className="text-sm font-bold text-zinc-200 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <Award className="w-4 h-4 text-violet-400" />
                     Recommendation
                  </h5>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                     {recommendation}
                  </p>
               </div>
            </div>

            {/* Strengths & Improvements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Strengths */}
               <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 space-y-3">
                  <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4" />
                     Key Strengths
                  </h5>
                  {strengths && strengths.length > 0 ? (
                     <ul className="space-y-2">
                        {strengths.map((strength, index) => (
                           <li key={index} className="text-sm text-zinc-300 flex items-start gap-2">
                              <span className="text-emerald-500 shrink-0 mt-1">•</span>
                              <span>{strength}</span>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-sm text-zinc-400 italic">No key strengths documented.</p>
                  )}
               </div>

               {/* Improvements */}
               <div className="p-5 rounded-xl border border-amber-500/10 bg-amber-500/5 space-y-3">
                  <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-outfit flex items-center gap-2">
                     <AlertCircle className="w-4 h-4" />
                     Areas for Improvement
                  </h5>
                  {improvements && improvements.length > 0 ? (
                     <ul className="space-y-2">
                        {improvements.map((improvement, index) => (
                           <li key={index} className="text-sm text-zinc-300 flex items-start gap-2">
                              <span className="text-amber-500 shrink-0 mt-1">•</span>
                              <span>{improvement}</span>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-sm text-zinc-400 italic">No improvements documented.</p>
                  )}
               </div>
            </div>
            <div className="h-4" />
         </div>
      </ModalWrapper>
   );
};
