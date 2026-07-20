import React from "react";
import { motion } from "motion/react";

interface FeatureRowProps {
   i: number;
   feature: { title: string; description: string };
   Icon: React.ElementType;
}

const FeatureRow = ({ i, feature, Icon }: FeatureRowProps) => {
   return (
      <motion.div
         initial={{ opacity: 0, x: -16 }}
         whileInView={{ opacity: 1, x: 0 }}
         viewport={{ once: true, margin: "-40px", amount: 0.1 }}
         transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
         className="group grid grid-cols-[3rem_1fr] lg:grid-cols-[4rem_1fr] gap-5 lg:gap-7 py-7 lg:py-8 2xl:py-9 border-b border-white/5 last:border-b-0 transition-colors duration-300 hover:border-white/10"
      >
         {/* Left: Index number */}
         <div className="pt-0.5 flex flex-col items-start gap-3">
            <span className="font-outfit font-bold text-2xl lg:text-3xl 2xl:text-4xl text-violet-500/30 group-hover:text-violet-500/60 transition-colors duration-300 leading-none tabular-nums">
               {String(i + 1).padStart(2, "0")}
            </span>
         </div>

         {/* Right: Icon + content */}
         <div className="flex flex-col sm:flex-row sm:items-start gap-4 lg:gap-6">
            <div className="shrink-0 inline-flex p-2.5 lg:p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:text-violet-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/15 transition-all duration-300 self-start">
               <Icon className="w-5 h-5 2xl:w-6 2xl:h-6" />
            </div>
            <div>
               <h3 className="font-outfit font-semibold text-base lg:text-lg 2xl:text-xl text-gray-100 group-hover:text-white transition-colors duration-300 mb-2">
                  {feature.title}
               </h3>
               <p className="font-inter text-sm 2xl:text-[15px] text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
               </p>
            </div>
         </div>
      </motion.div>
   );
};

export default FeatureRow;
