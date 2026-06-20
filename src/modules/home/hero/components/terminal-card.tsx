"use client";

import { Terminal } from "@/components/ui/terminal";
import { motion } from "motion/react";

const reactCode = `import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function EvaloHero() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-12 rounded-xl bg-violet-600/10 border border-violet-800/20"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className={isHovered ? "text-amber-400 animate-pulse" : "text-violet-400"} />
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Welcome to Evalo
        </h1>
      </div>
      
      <p className="text-lg text-neutral-400 max-w-md text-center">
        {isHovered 
          ? "You found the secret interaction!" 
          : "Start evaluating your projects with modern tools today."}
      </p>
      
      <motion.button 
        className="mt-8 px-6 py-3 rounded-full bg-violet-600 text-white font-medium"
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
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
         className="w-full pt-14 lg:pt-16 2xl:pt-20 relative z-999"
      >
         <Terminal
            code={reactCode}
            filename="EvaloHero.tsx"
            typingSpeed={15}
            initialDelay={1500}
         />
      </motion.div>
   );
}
