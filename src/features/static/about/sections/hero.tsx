"use client";

import Link from "next/link";
import { motion } from "motion/react";
import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { Button } from "@/components/ui/button";
import { aboutData } from "@/data/about/about.data";

const Hero = () => {
   const {
      header,
      icon: HeaderIcon,
      title,
      description,
      primaryCta,
      secondaryCta,
      radarHub,
      satelliteNodes,
      pillars,
   } = aboutData.hero;

   return (
      <div className="s-padding-t relative z-20">
         <div className="container">
            {/* Asymmetric Split Layout: Left Editorial / Right Radial Telemetry Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 2xl:gap-16 items-center">
               {/* Left Side: Brand Narrative & CTAs (Gaps, sizing, and responsiveness exactly matching Home Hero) */}
               <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="lg:col-span-6 flex flex-col max-lg:text-center items-center lg:items-start"
               >
                  {/* Eyebrow Header */}
                  <div className="mb-3 2xl:mb-4">
                     <HeaderText icon={HeaderIcon} text={header} />
                  </div>

                  {/* Main Title */}
                  <h1 className="w-full text-5xl md:text-[54px] font-bold lg:text-6xl 2xl:text-[80px] text-zinc-100 font-bricolage leading-[1.1] tracking-tight pb-1 2xl:pb-2">
                     {title}
                  </h1>

                  {/* Description using PrimaryBody */}
                  <PrimaryBody
                     text={description}
                     className="max-w-full lg:max-w-2xl mt-0.5 py-4 text-[15px] lg:text-[15px] 2xl:text-lg text-zinc-300 leading-relaxed"
                  />

                  {/* Action Buttons */}
                  <div className="mt-4 lg:mt-5 2xl:mt-6 flex flex-wrap items-center gap-2.5 md:gap-3 2xl:gap-4">
                     <Link href={primaryCta.href}>
                        <Button size="xxl" variant="white" className="gap-2">
                           <span>{primaryCta.text}</span>
                        </Button>
                     </Link>
                     <Link href={secondaryCta.href}>
                        <Button size="xxl" variant="outline">
                           {secondaryCta.text}
                        </Button>
                     </Link>
                  </div>
               </motion.div>

               {/* Right Side: Symmetrically Calibrated Radial Telemetry Hub (6 Cols) */}
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
                  className="lg:col-span-6 relative flex items-center justify-center"
               >
                  {/* Ambient Core Glow */}
                  <div className="absolute max-sm:hidden sm:w-110 sm:h-110 rounded-full bg-violet-600/15 blur-[90px] pointer-events-none" />

                  {/* 1. Mobile Layout (< sm width): Full Concentric Radar Circle matching bigger screens + Clean Stacked Content */}
                  <div className="flex sm:hidden flex-col items-center gap-6 w-full max-w-sm">
                     {/* Mobile Radar Circle (Prominent & scaled up to match bigger screen visual presence) */}
                     <div className="relative flex items-center justify-center w-72 h-72 min-[400px]:w-80 min-[400px]:h-80 mb-4">
                        {/* Mobile Ambient Glow */}
                        <div className="absolute w-75 h-75 rounded-full bg-violet-600/15 blur-[60px] pointer-events-none" />

                        <svg
                           className="absolute inset-0 w-full h-full pointer-events-none"
                           viewBox="0 0 320 320"
                           fill="none"
                        >
                           {/* Outer Geometric Ring */}
                           <circle
                              cx="160"
                              cy="160"
                              r="148"
                              stroke="rgba(255, 255, 255, 0.05)"
                              strokeWidth="1"
                              strokeDasharray="4 6"
                           />
                           {/* Mid Precision Ring */}
                           <circle
                              cx="160"
                              cy="160"
                              r="105"
                              stroke="rgba(139, 92, 246, 0.16)"
                              strokeWidth="1"
                           />
                           {/* Inner Core Ring */}
                           <circle
                              cx="160"
                              cy="160"
                              r="60"
                              stroke="rgba(167, 139, 250, 0.22)"
                              strokeWidth="1.2"
                              strokeDasharray="2 4"
                           />
                        </svg>
                        <div className="relative z-10 flex flex-col items-center justify-center w-28 h-28 min-[400px]:w-32 min-[400px]:h-32 rounded-full bg-surface border border-violet-500/40 shadow-[0_0_36px_rgba(139,92,246,0.35)] text-center p-3">
                           <span className="font-geist font-bold text-sm min-[400px]:text-base text-zinc-100 leading-tight">
                              {radarHub.title}
                           </span>
                        </div>
                     </div>

                     {/* Mobile Content (3 Clean Stacked Satellite Nodes) */}
                     <div className="w-full space-y-4">
                        {satelliteNodes.map((node) => {
                           const Icon = node.icon;
                           return (
                              <div
                                 key={node.id}
                                 className="w-full flex flex-col items-center text-center space-y-2 p-3.5 rounded-2xl bg-surface/60 border border-white/8"
                              >
                                 {/* 1. Header Pill */}
                                 <div className="inline-flex items-center gap-1.5 text-violet-300 text-xs font-mono shadow-md w-full justify-center pb-1">
                                    <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                                    <span>{node.title}</span>
                                 </div>

                                 {/* 2. 2x2 Grid of Chips */}
                                 <div className="grid grid-cols-2 gap-1.5 w-full">
                                    {node.items.map((item, idx) => (
                                       <div
                                          key={idx}
                                          className="py-1.5 px-2 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center justify-center"
                                       >
                                          <span className="font-semibold text-xs text-zinc-200 leading-tight truncate w-full text-center">
                                             {item.label}
                                          </span>
                                       </div>
                                    ))}
                                 </div>

                                 {/* 3. Footer Status Beacon */}
                                 <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 w-full pt-0.5">
                                    <span className="truncate">{node.status}</span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  {/* 2. Tablet & Desktop Layout (>= sm width): Circular Radar Layout (Untouched) */}
                  <div className="hidden sm:flex relative w-full max-w-140 h-full sm:h-140 items-center justify-center">
                     {/* SVG Precision Conduits & Orbital Rings */}
                     <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 500 480"
                        fill="none"
                     >
                        {/* Outer Geometric Ring */}
                        <circle
                           cx="250"
                           cy="240"
                           r="200"
                           stroke="rgba(255, 255, 255, 0.05)"
                           strokeWidth="1"
                           strokeDasharray="4 6"
                        />
                        {/* Mid Precision Ring */}
                        <circle
                           cx="250"
                           cy="240"
                           r="140"
                           stroke="rgba(139, 92, 246, 0.16)"
                           strokeWidth="1"
                        />
                        {/* Inner Core Ring */}
                        <circle
                           cx="250"
                           cy="240"
                           r="78"
                           stroke="rgba(167, 139, 250, 0.22)"
                           strokeWidth="1.2"
                           strokeDasharray="2 4"
                        />

                        {/* Radial Conduits from Central Core to Satellite Nodes */}
                        {/* Conduit 01: To Top Node */}
                        <line
                           x1="250"
                           y1="162"
                           x2="250"
                           y2="92"
                           stroke="url(#conduit-top)"
                           strokeWidth="1.5"
                        />
                        {/* Conduit 02: To Bottom-Left Node */}
                        <line
                           x1="195"
                           y1="295"
                           x2="105"
                           y2="370"
                           stroke="url(#conduit-bl)"
                           strokeWidth="1.5"
                        />
                        {/* Conduit 03: To Bottom-Right Node */}
                        <line
                           x1="305"
                           y1="295"
                           x2="395"
                           y2="370"
                           stroke="url(#conduit-br)"
                           strokeWidth="1.5"
                        />

                        {/* Linear Gradient Fills for Conduits */}
                        <defs>
                           <linearGradient id="conduit-top" x1="250" y1="162" x2="250" y2="92">
                              <stop stopColor="#a78bfa" stopOpacity="0.8" />
                              <stop stopColor="#818cf8" stopOpacity="0.2" />
                           </linearGradient>
                           <linearGradient id="conduit-bl" x1="195" y1="295" x2="105" y2="370">
                              <stop stopColor="#a78bfa" stopOpacity="0.8" />
                              <stop stopColor="#6366f1" stopOpacity="0.2" />
                           </linearGradient>
                           <linearGradient id="conduit-br" x1="305" y1="295" x2="395" y2="370">
                              <stop stopColor="#a78bfa" stopOpacity="0.8" />
                              <stop stopColor="#10b981" stopOpacity="0.2" />
                           </linearGradient>
                        </defs>
                     </svg>

                     {/* Central Hub Core */}
                     <div className="relative z-10 flex flex-col items-center justify-center w-26 h-26 sm:w-28 sm:h-28 rounded-full bg-surface border border-violet-500/40 shadow-[0_0_36px_rgba(139,92,246,0.3)] text-center p-3">
                        <span className="font-geist font-bold text-xs sm:text-sm text-zinc-100 leading-tight">
                           {radarHub.title}
                        </span>
                     </div>

                     {/* 3 Unified Satellite Nodes Loaded from Data */}
                     {satelliteNodes.map((node) => {
                        const Icon = node.icon;
                        return (
                           <div
                              key={node.id}
                              className={`absolute ${node.positionClass} w-45 sm:w-48 flex flex-col items-center text-center space-y-2 z-10`}
                           >
                              {/* 1. Standardized Header Pill */}
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.25 rounded-full bg-surface-dark/90 border border-violet-500/30 text-violet-300 text-xs font-mono shadow-md w-full justify-center">
                                 <Icon className={`w-3.5 h-3.5 ${node.iconColor}`} />
                                 <span>
                                    {node.title}
                                 </span>
                              </div>

                              {/* 2. Standardized 2x2 Clean Chip Matrix */}
                              <div className="grid grid-cols-2 gap-1.5 w-full">
                                 {node.items.map((item, idx) => (
                                    <div
                                       key={idx}
                                       className="py-1.25 px-1.5 rounded-lg bg-white/5 border border-white/5 flex flex-col items-center justify-center"
                                    >
                                       <span className="font-semibold text-xs text-zinc-200 leading-tight truncate w-full text-center">
                                          {item.label}
                                       </span>
                                    </div>
                                 ))}
                              </div>

                              {/* 3. Standardized Footer Status Beacon */}
                              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-400 w-full">
                                 <span className="truncate">{node.status}</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </motion.div>
            </div>

            {/* 3 Value Pillar Cards at Bottom using SecondaryTitle and PrimaryBody */}
            <div className="mt-12 sm:mt-16 lg:mt-18 2xl:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
               {pillars.map((pillar, idx) => (
                  <motion.div
                     key={idx}
                     initial={{ opacity: 0, y: 24 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px", amount: 0.1 }}
                     transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                     className="group relative px-6 py-7 2xl:p-7 rounded-3xl bg-surface-dark border border-white/5 hover:border-violet-500/40 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between space-y-4"
                  >

                     <div className="relative z-10 flex flex-col gap-3">
                        <span className="font-mono font-bold text-2xl lg:text-3xl text-violet-400/70 group-hover:text-violet-300 transition-colors duration-200 leading-none mb-1.5 2xl:mb-2">
                           {pillar.number}
                        </span>
                        <SecondaryTitle
                           text={pillar.title}
                           className="font-semibold text-lg lg:text-xl 2xl:text-xl text-zinc-100 group-hover:text-white transition-colors duration-200"
                        />
                        <PrimaryBody
                           text={pillar.description}
                           className="text-sm lg:text-sm 2xl:text-[15px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-200"
                        />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Hero;
