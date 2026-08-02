"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
   Sparkles,
   Activity,
   TrendingUp,
   Check,
   ArrowRight
} from "lucide-react";

export default function AuthBranding() {
   const [activeTab, setActiveTab] = useState<"architecture" | "optimization" | "quality">("architecture");

   // Cycle through tabs to showcase the system dynamically
   useEffect(() => {
      const interval = setInterval(() => {
         setActiveTab((current) => {
            if (current === "architecture") return "optimization";
            if (current === "optimization") return "quality";
            return "architecture";
         });
      }, 3500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="w-full h-full min-h-screen bg-[#0e111a] p-8 lg:p-16 2xl:p-20 flex flex-col justify-between relative overflow-hidden select-none border-r border-zinc-800/80">

         {/* Subtle Warm Ambient Glows & Technical Grid */}
         <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Smooth SVG gradients with subtle noise filter to eliminate color banding and create a velvety finish */}
            <svg className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
               <defs>
                  {/* Top-Right Glow */}
                  <radialGradient id="top-right-glow" cx="95%" cy="5%" r="60%">
                     <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
                     <stop offset="50%" stopColor="rgba(99, 102, 241, 0.05)" />
                     <stop offset="100%" stopColor="rgba(14, 17, 26, 0)" />
                  </radialGradient>

                  {/* Bottom-Left Glow */}
                  <radialGradient id="bottom-left-glow" cx="5%" cy="95%" r="60%">
                     <stop offset="0%" stopColor="rgba(219, 39, 119, 0.15)" />
                     <stop offset="50%" stopColor="rgba(139, 92, 246, 0.05)" />
                     <stop offset="100%" stopColor="rgba(14, 17, 26, 0)" />
                  </radialGradient>

                  {/* Noise Texture to dither gradients and prevent banding */}
                  <filter id="noise-dither">
                     <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                     <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.025 0" />
                  </filter>
               </defs>

               {/* Gradient fills */}
               <rect width="100%" height="100%" fill="url(#top-right-glow)" />
               <rect width="100%" height="100%" fill="url(#bottom-left-glow)" />

               {/* Noise Overlay */}
               <rect width="100%" height="100%" filter="url(#noise-dither)" />
            </svg>

            {/* Premium, ultra-thin dotted grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#222f44_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-40" />
         </div>

         {/* Header Branding Area */}
         <div className="z-10 relative space-y-5">
            <div className="space-y-3 2xl:space-y-3.5 max-w-xl">
               <h2 className="text-3xl 2xl:text-4xl font-bold tracking-tight text-white leading-tight font-heading">
                  High-fidelity talent validation <span className="bg-linear-to-r from-violet-400 via-violet-400 to-violet-300 bg-clip-text text-transparent">engineered for scale.</span>
               </h2>
               <p className="text-zinc-400 text-sm leading-relaxed max-w-lg">
                  Say goodbye to arbitrary tech assessments. Evalo analyzes architecture logic, performance limits, and security posture automatically.
               </p>
            </div>
         </div>

         {/* Interactive Showcase Dashboard */}
         <div className="z-10 mt-2 2xl:mt-4 mb-12 py-8 relative w-full max-w-xl mx-auto flex flex-col items-center">

            {/* Outer Mockup Shell */}
            <div className="w-full bg-[#151926]/90 rounded-2xl border border-zinc-800/80 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
               {/* Dashboard Title Bar */}
               <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/50 bg-[#121520]/80">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-zinc-700" />
                        <span className="size-2 rounded-full bg-zinc-700" />
                        <span className="size-2 rounded-full bg-zinc-700" />
                     </div>
                     <span className="h-4 w-px bg-[#1e293b]" />
                     <span className="text-xs font-semibold text-zinc-300 tracking-wide">Candidate Assessment Report</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wide">
                     READY TO HIRE
                  </span>
               </div>

               {/* Profile Snapshot */}
               <div className="p-5 border-b border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                     <div className="relative">
                        <img
                           src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                           alt="Candidate Profile"
                           className="size-11 rounded-full object-cover border border-zinc-700"
                        />
                        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-[#151926]" />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-white">Sarah Jenkins</h4>
                        <p className="text-xs text-zinc-400">Lead Infrastructure Engineer</p>
                     </div>
                  </div>

                  <div className="text-right">
                     <div className="text-2xl font-black text-violet-400 leading-none">96<span className="text-xs text-zinc-500 font-medium">/100</span></div>
                     <div className="text-[10px] text-zinc-400 font-medium mt-1">Evalo Score</div>
                  </div>
               </div>

               {/* Simulated Tabs */}
               <div className="px-5 py-2.5 bg-[#121520]/50 border-b border-zinc-800/50 flex items-center gap-4 text-xs font-semibold">
                  <button
                     onClick={() => setActiveTab("architecture")}
                     className={`pb-1 transition-all border-b-2 ${activeTab === "architecture" ? "border-violet-500 text-white" : "border-transparent text-zinc-400"}`}
                  >
                     Architecture
                  </button>
                  <button
                     onClick={() => setActiveTab("optimization")}
                     className={`pb-1 transition-all border-b-2 ${activeTab === "optimization" ? "border-violet-500 text-white" : "border-transparent text-zinc-400"}`}
                  >
                     Optimization
                  </button>
                  <button
                     onClick={() => setActiveTab("quality")}
                     className={`pb-1 transition-all border-b-2 ${activeTab === "quality" ? "border-violet-500 text-white" : "border-transparent text-zinc-400"}`}
                  >
                     Code Quality
                  </button>
               </div>

               {/* Tab Contents Viewport */}
               <div className="p-5 min-h-35 flex flex-col justify-center bg-[#151926]/40">
                  <AnimatePresence mode="wait">
                     {activeTab === "architecture" && (
                        <motion.div
                           key="architecture"
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -5 }}
                           transition={{ duration: 0.2 }}
                           className="space-y-3.5"
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Decoupled State Management
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">98%</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Database Normalization Standard
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">94%</span>
                           </div>
                           <p className="text-[11px] text-zinc-400 leading-normal">
                              Candidate demonstrated deep knowledge of scalable caching strategies and optimized database constraints under load simulation.
                           </p>
                        </motion.div>
                     )}

                     {activeTab === "optimization" && (
                        <motion.div
                           key="optimization"
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -5 }}
                           transition={{ duration: 0.2 }}
                           className="space-y-3.5"
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Time Complexity Analysis (O(N))
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">100%</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Memory Allocation & Leaks
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">90%</span>
                           </div>
                           <p className="text-[11px] text-zinc-400 leading-normal">
                              Memory leaks checked automatically against mock telemetry runs. Execution times fell within the top 2% of candidates globally.
                           </p>
                        </motion.div>
                     )}

                     {activeTab === "quality" && (
                        <motion.div
                           key="quality"
                           initial={{ opacity: 0, y: 5 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -5 }}
                           transition={{ duration: 0.2 }}
                           className="space-y-3.5"
                        >
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Type Definitions & Coverage
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">96%</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                                 <Check className="size-4 text-emerald-400" />
                                 Linter Compliance & Readability
                              </span>
                              <span className="text-xs font-bold bg-zinc-800/60 px-2 py-0.5 rounded text-white border border-zinc-700/50">100%</span>
                           </div>
                           <p className="text-[11px] text-zinc-400 leading-normal">
                              Candidate codebase contains rigorous type definitions, clean documentation, and follows standard object-oriented/functional paradigms.
                           </p>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Overlapping floating statistics chip */}
            <motion.div
               animate={{ y: [0, -6, 0] }}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               className="absolute -bottom-4 right-6 bg-[#0e111a] text-white rounded-xl py-3 px-4.5 border border-zinc-800 shadow-xl flex items-center gap-3"
            >
               <div className="size-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Sparkles className="size-4" />
               </div>
               <div>
                  <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">AI RECOMMENDATION</div>
                  <div className="text-[11px] font-semibold flex items-center gap-1">
                     Strong Hire (Top 1%) <ArrowRight className="size-3 text-violet-400" />
                  </div>
               </div>
            </motion.div>
         </div>

         {/* Bottom Footer Area */}
         <div className="z-10 pt-5 2xl:pt-6 border-t border-violet-400/20 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center gap-1.5">
               <Activity className="size-3.5 text-zinc-500" />
               TELEMETRY SYSTEMS ACTIVE
            </div>
            <div className="flex items-center gap-1.5">
               <TrendingUp className="size-3.5 text-zinc-500" />
               REAL-TIME PERFORMANCE PROFILING
            </div>
         </div>
      </div>
   );
}