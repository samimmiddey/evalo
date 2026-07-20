"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaqItem as FaqItemType } from "@/data/contact/contact.types";

interface FaqItemProps {
   item: FaqItemType;
   index: number;
}

const FaqItem = ({ item, index }: FaqItemProps) => {
   const [open, setOpen] = useState(false);

   return (
      <motion.div
         initial={{ opacity: 0, y: 16 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-40px", amount: 0.1 }}
         transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
         className="border-b border-white/5 last:border-b-0"
      >
         <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            id={`faq-btn-${index}`}
            aria-controls={`faq-panel-${index}`}
            className="group w-full flex items-start gap-4 lg:gap-6 py-6 lg:py-7 2xl:py-8 text-left transition-colors duration-200 cursor-pointer"
         >
            {/* Index number */}
            <span className="shrink-0 font-outfit font-bold text-xl lg:text-2xl 2xl:text-3xl text-violet-500/30 group-hover:text-violet-500/60 transition-colors duration-300 leading-none tabular-nums mt-0.5 select-none">
               {String(index + 1).padStart(2, "0")}
            </span>

            {/* Question text */}
            <span className="flex-1 font-outfit font-semibold text-base lg:text-lg 2xl:text-xl text-gray-200 group-hover:text-white transition-colors duration-300 leading-snug">
               {item.question}
            </span>

            {/* Expand icon */}
            <span
               className="shrink-0 mt-0.5 h-6 w-6 2xl:h-7 2xl:w-7 rounded-full border border-violet-500/25 flex items-center justify-center bg-violet-500/5 group-hover:border-violet-500/50 group-hover:bg-violet-500/10 transition-all duration-300"
               aria-hidden="true"
            >
               <motion.svg
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="h-3.5 w-3.5 2xl:h-4 2xl:w-4 text-violet-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
               >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
               </motion.svg>
            </span>
         </button>

         <AnimatePresence initial={false}>
            {open && (
               <motion.div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  key="faq-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
               >
                  <p className="pl-10 lg:pl-14 pb-6 lg:pb-7 2xl:pb-8 font-inter text-sm 2xl:text-[15px] text-gray-400 leading-relaxed max-w-3xl">
                     {item.answer}
                  </p>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
};

export default FaqItem;
