"use client";

import { motion } from "motion/react";
import { Star, Briefcase } from "lucide-react";

const experts = [
   {
      name: "Alex M.",
      role: "Staff Engineer · Google",
      specialty: "System Design",
      rating: 5.0,
      sessions: 142,
      initials: "AM",
      colorFrom: "from-violet-500",
      colorTo: "to-fuchsia-500",
      delay: 0,
   },
   {
      name: "Priya K.",
      role: "Senior SDE · Amazon",
      specialty: "DSA & Algorithms",
      rating: 4.9,
      sessions: 98,
      initials: "PK",
      colorFrom: "from-blue-500",
      colorTo: "to-cyan-500",
      delay: 0.1,
   },
   {
      name: "James R.",
      role: "Tech Lead · Meta",
      specialty: "Frontend & React",
      rating: 5.0,
      sessions: 211,
      initials: "JR",
      colorFrom: "from-emerald-500",
      colorTo: "to-teal-500",
      delay: 0.2,
   },
];

export function ExpertCardsPreview() {
   return (
      <motion.div
         initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
         animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
         transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
         className="w-full max-w-5xl mx-auto pt-14 lg:pt-16 2xl:pt-20 relative z-10 group"
      >
         {/* Ambient glow behind the cards */}
         <div className="absolute inset-0 mt-16 bg-linear-to-r from-violet-600/15 via-fuchsia-600/10 to-blue-600/15 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none rounded-[3rem]" />

         <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {experts.map((expert, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + expert.delay, ease: "easeOut" }}
                  className="relative flex flex-col gap-4 p-5 lg:p-6 rounded-2xl bg-surface-dark/50 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-15px_rgba(139,92,246,0.2)] ring-1 ring-white/5 hover:border-white/20 hover:bg-surface-dark/70 transition-all duration-300"
               >
                  {/* Avatar */}
                  <div className="flex items-center gap-3.5">
                     <div
                        className={`w-11 h-11 rounded-full bg-linear-to-br ${expert.colorFrom} ${expert.colorTo} flex items-center justify-center text-white text-sm font-bold font-outfit shrink-0 shadow-md`}
                     >
                        {expert.initials}
                     </div>
                     <div className="min-w-0">
                        <p className="text-gray-100 font-semibold font-outfit text-sm truncate">
                           {expert.name}
                        </p>
                        <p className="text-gray-400 text-xs font-inter truncate">
                           {expert.role}
                        </p>
                     </div>
                  </div>

                  {/* Specialty badge */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-inter">
                     <Briefcase className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                     <span>{expert.specialty}</span>
                  </div>

                  {/* Rating and sessions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                     <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-medium text-gray-200">
                           {expert.rating.toFixed(1)}
                        </span>
                     </div>
                     <span className="text-xs text-gray-500 font-inter">
                        {expert.sessions} sessions
                     </span>
                  </div>
               </motion.div>
            ))}
         </div>
      </motion.div>
   );
}
