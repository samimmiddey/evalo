"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaqItem as FaqItemType } from "@/data/contact/contact.types";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItemProps {
   item: FaqItemType;
   index: number;
}

const FaqItem = ({ item, index }: FaqItemProps) => {
   const [open, setOpen] = useState(false);
   const indexStr = String(index + 1).padStart(2, "0");

   return (
      <div className="border-b border-white/10 last:border-b-0 py-5 2xl:py-6">
         <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            id={`faq-btn-${index}`}
            aria-controls={`faq-panel-${index}`}
            className="w-full flex items-center justify-between gap-4 text-left transition-colors cursor-pointer select-none group"
         >
            <div className="flex items-start gap-4 min-w-0 pr-2">
               <span className="font-mono text-sm 2xl:text-base text-zinc-500 font-medium shrink-0 mt-0.75 lg:mt-1 2xl:mt-0.5">
                  {indexStr}
               </span>
               <h3 className="font-outfit font-medium text-base lg:text-lg 2xl:text-xl text-zinc-300 group-hover:text-white transition-colors">
                  {item.question}
               </h3>
            </div>

            <div
               className={cn(
                  "w-7 h-7 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all",
                  open && "rotate-45 text-white border-white/30"
               )}
            >
               <Plus className="w-3.5 h-3.5 transition-transform" />
            </div>
         </button>

         <AnimatePresence initial={false}>
            {open && (
               <motion.div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-btn-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
               >
                  <p className="pl-9 pt-3 text-sm lg:text-base text-zinc-400 leading-relaxed max-w-3xl">
                     {item.answer}
                  </p>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default FaqItem;
