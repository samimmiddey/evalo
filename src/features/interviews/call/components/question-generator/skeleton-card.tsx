import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

const THINKING_STEPS = [
   'Analyzing domain concepts & best practices...',
   'Synthesizing real-world interview scenarios...',
   'Drafting model answers & evaluation benchmarks...',
   'Finalizing difficulty tiers & follow-up probes...',
];

const PulsingBrain = () => {
   return (
      <div className="relative flex items-center justify-center size-4">
         {/* Base Dim Brain Icon */}
         <Brain className="size-4 text-zinc-600/80 shrink-0" />

         {/* Glowing Electric Pulse Layer Sweeping Left to Right */}
         <div className="absolute inset-0 flex items-center justify-center brain-signal-mask pointer-events-none">
            <Brain className="size-4 text-violet-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.85)] shrink-0" />
         </div>

         <style jsx>{`
            .brain-signal-mask {
               mask-image: linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(0, 0, 0, 0.15) 30%,
                  rgba(0, 0, 0, 1) 50%,
                  rgba(0, 0, 0, 0.15) 70%,
                  transparent 100%
               );
               -webkit-mask-image: linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(0, 0, 0, 0.15) 30%,
                  rgba(0, 0, 0, 1) 50%,
                  rgba(0, 0, 0, 0.15) 70%,
                  transparent 100%
               );
               mask-size: 250% 100%;
               -webkit-mask-size: 250% 100%;
               animation: brainSignalSweep 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            @keyframes brainSignalSweep {
               0% {
                  mask-position: 150% 0;
                  -webkit-mask-position: 150% 0;
               }
               100% {
                  mask-position: -50% 0;
                  -webkit-mask-position: -50% 0;
               }
            }
         `}</style>
      </div>
   );
};

export const LoadingState = () => {
   const [stepIndex, setStepIndex] = useState<number>(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
      }, 2500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="flex flex-col gap-3 pb-2 w-full animate-in fade-in duration-300">
         {/* Thinking Status Pill */}
         <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-900/90 border border-violet-500/20 shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
               <div className="relative flex items-center justify-center size-5 rounded-md bg-violet-500/15 text-violet-300 shrink-0">
                  <PulsingBrain />
               </div>
               <span className="text-xs font-medium text-zinc-300 truncate">
                  {THINKING_STEPS[stepIndex]}
               </span>
            </div>
         </div>

         {/* Skeleton Question Cards */}
         <div className="flex flex-col gap-2.5">
            {[1, 2, 3].map((num) => (
               <div
                  key={num}
                  className="relative overflow-hidden rounded-xl bg-zinc-900/80 border border-white/10 p-3.5 shadow-sm"
               >
                  {/* Subtle Gradient Shimmer Light Sweep */}
                  <div
                     className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-violet-500/5 to-transparent pointer-events-none"
                     style={{
                        animationDuration: '1.8s',
                        animationDelay: `${num * 0.25}s`,
                     }}
                  />

                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                     <div className="flex items-center gap-2 flex-1">
                        <div className="size-5 rounded-md bg-zinc-800 animate-pulse shrink-0" />
                        <div
                           className="h-3.5 rounded-md bg-zinc-800/90 animate-pulse"
                           style={{ width: num === 1 ? '55%' : num === 2 ? '70%' : '60%' }}
                        />
                     </div>
                     <div className="h-4 w-12 rounded-full bg-zinc-800/80 animate-pulse shrink-0" />
                  </div>

                  {/* Question Body Lines */}
                  <div className="flex flex-col gap-2 mb-3">
                     <div className="h-2.5 w-full rounded-md bg-zinc-800/60 animate-pulse" />
                     <div className="h-2.5 w-[92%] rounded-md bg-zinc-800/60 animate-pulse" />
                     <div
                        className="h-2.5 rounded-md bg-zinc-800/60 animate-pulse"
                        style={{ width: num === 2 ? '75%' : '60%' }}
                     />
                  </div>

                  {/* Accordion Footer Skeleton */}
                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                     <div className="h-2.5 w-32 rounded-md bg-zinc-800/40 animate-pulse" />
                     <div className="size-3 rounded-md bg-zinc-800/40 animate-pulse" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};