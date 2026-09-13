"use client";

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FeatureCard as FeatureCardType } from '@/data/home/home.types';

interface FeatureCardProps {
   i: number;
   feature: FeatureCardType;
   className?: string;
}

const FeatureCard = ({ i, feature, className }: FeatureCardProps) => {
   const numberStr = String(i + 1).padStart(2, '0');
   const Icon = feature.icon;
   const theme = feature.theme;

   return (
      <motion.div
         key={i}
         initial={{ opacity: 0, y: 24 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
         className={`group relative flex flex-col justify-between p-7 sm:p-8 lg:p-9 2xl:p-10 rounded-3xl bg-surface-dark/90 border ${theme.border} ${theme.hoverBorder} overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${theme.shadow} ${className ?? ""}`}
      >
         {/* Top Gradient Wash */}
         <div className={`absolute inset-0 bg-linear-to-b ${theme.gradient} pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`} />

         {/* Top Border Shimmer */}
         <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 ${theme.topShimmer} to-transparent transition-colors duration-500 pointer-events-none`} />

         {/* Ambient Radial Glow Orb */}
         <div className={`pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[80px] transition-all duration-700 ${theme.glow}`} />

         <div className="relative z-10">
            {/* Header: Icon & Monospace Counter */}
            <div className="flex items-center justify-between mb-6 lg:mb-8">
               <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${theme.iconBg} ${theme.iconBorder} ${theme.iconText} border shadow-inner transition-all duration-300 group-hover:scale-105`}>
                  <Icon className="w-5.5 h-5.5 2xl:w-6 2xl:h-6" />
               </div>
               <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/2 border border-white/5">
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
                  <span className={`font-mono text-xs font-semibold tracking-wider ${theme.badgeText}`}>
                     {numberStr}
                  </span>
               </div>
            </div>

            {/* Title */}
            <h3 className="text-xl lg:text-2xl font-semibold font-outfit text-zinc-100 tracking-tight mb-3 lg:mb-4 group-hover:text-white transition-colors duration-200">
               {feature.title}
            </h3>

            {/* Description */}
            <p className="text-zinc-400 font-inter text-sm lg:text-[15px] 2xl:text-base leading-relaxed group-hover:text-zinc-300 transition-colors duration-200">
               {feature.description}
            </p>
         </div>

         {/* Bottom Row */}
         <div className="relative z-10 mt-7 2xl:mt-8 pt-5 border-t border-white/6 flex items-center justify-between text-xs">
            {/* Category Eyebrow */}
            <div className="flex items-center gap-2 mb-2 lg:mb-2.5">
               <span className={`font-mono text-xs font-semibold uppercase tracking-wider ${theme.badgeText}`}>
                  {feature.tag}
               </span>
            </div>
            <div className={`w-8 h-8 rounded-full bg-white/3 border border-white/8 ${theme.arrowHover} flex items-center justify-center text-zinc-400 transition-all duration-300`}>
               <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
         </div>
      </motion.div>
   );
};

export default FeatureCard;