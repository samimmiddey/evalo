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
         initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
         animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
         transition={{
            duration: 0.5,
            delay: 1.25,
            ease: "easeInOut",
         }}
         className="w-full pt-14 lg:pt-16 2xl:pt-20 relative z-9"
      >
         <Terminal
            code={reactCode}
            filename="two-sum.ts"
            typingSpeed={12}
            initialDelay={1500}
         />
      </motion.div>
   );
}
