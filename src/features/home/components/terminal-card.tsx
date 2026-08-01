"use client";

import { Terminal } from "@/components/ui/terminal";
import { motion } from "motion/react";

const reactCode = `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`;

export function TerminalCard() {
   return (
      <motion.div
         initial={{ opacity: 0, filter: "blur(4px)", y: 20 }}
         animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
         transition={{
            duration: 0.8,
            delay: 1.25,
            ease: "easeOut",
         }}
         className="w-full max-w-5xl mx-auto pt-14 lg:pt-16 2xl:pt-20 relative z-10 group"
      >
         {/* Premium Glow Behind the Terminal */}
         <div className="absolute inset-0 mt-20 bg-linear-to-r from-violet-600/20 to-fuchsia-600/20 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none rounded-[3rem]" />

         <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] bg-surface-dark/50 backdrop-blur-xl ring-1 ring-white/5">
            <Terminal
               code={reactCode}
               filename="two-sum.ts"
               typingSpeed={12}
               initialDelay={1500}
            />
         </div>
      </motion.div>
   );
}
