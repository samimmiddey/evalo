"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoleDataTypes } from "@/data/home/home.types";

import { Button } from "@/components/ui/button";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";

interface RoleCardProps {
   data: RoleDataTypes;
}

const RoleCard = ({ data }: RoleCardProps) => {
   const roles = [data.interviewee, data.interviewer];

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 2xl:gap-8 w-full">
         {roles.map((role, idx) => {
            const Icon = role.icon;

            return (
               <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px", amount: 0.1 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                  className="group relative flex flex-col justify-between px-6 py-7 sm:p-9 lg:p-11 xl:p-12 rounded-3xl border border-white/8 bg-surface-dark/95 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.7)] hover:bg-white/1.5"
               >
                  {/* Top Border Shimmer */}
                  <div
                     className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-white/10 ${role.theme.topShimmer} to-transparent transition-colors duration-500 pointer-events-none`}
                  />

                  {/* Ambient Radial Glow Orb */}
                  <div
                     className={`pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[90px] transition-all duration-700 ${role.theme.glow}`}
                  />

                  {/* Background Watermark Index */}
                  <span className="absolute top-4 right-6 sm:top-6 sm:right-8 font-mono text-7xl sm:text-8xl font-black text-white/2 group-hover:text-white/4 transition-colors duration-500 pointer-events-none select-none">
                     {role.index}
                  </span>

                  {/* Content Container */}
                  <div className="relative z-10 space-y-6 sm:space-y-7">
                     {/* Track Header & Monospace Identifier */}
                     <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                           <div
                              className={`w-11 h-11 rounded-xl border ${role.theme.iconBorder} ${role.theme.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-sm`}
                           >
                              <Icon className={`w-5 h-5 ${role.theme.iconText}`} />
                           </div>
                           <div>
                              <div className="text-xs sm:text-sm font-semibold text-zinc-200 uppercase tracking-wide group-hover:text-white transition-colors duration-200">
                                 {role.tag}
                              </div>
                              <div className="text-xs font-mono font-medium tracking-wider text-zinc-400 uppercase mt-0.5 group-hover:text-zinc-300 transition-colors duration-200">
                                 {role.trackLabel}
                              </div>
                           </div>
                        </div>

                        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/8 text-xs font-mono text-zinc-300 transition-colors duration-300 group-hover:border-white/[0.14]">
                           <span className={`w-1.5 h-1.5 rounded-full ${role.theme.dotBg}`} />
                           <span>{role.statusLabel}</span>
                        </div>
                     </div>

                     {/* Title & Description */}
                     <div className="space-y-3">
                        <SecondaryTitle
                           text={role.title}
                           className="text-xl sm:text-2xl lg:text-3xl 2xl:text-3xl tracking-tight leading-snug group-hover:text-white transition-colors duration-200"
                        />
                        <PrimaryBody
                           text={role.description}
                           className="text-sm sm:text-base lg:text-base 2xl:text-base leading-relaxed group-hover:text-zinc-300 transition-colors duration-200"
                        />
                     </div>

                     {/* Capabilities Connected Pipeline */}
                     <div className="pt-2">
                        {role.workflowTitle && (
                           <div className="text-xs sm:text-[13px] font-mono font-semibold tracking-wider text-zinc-400 uppercase mb-3.5 group-hover:text-zinc-300 transition-colors duration-200">
                              {role.workflowTitle}
                           </div>
                        )}
                        <div className="space-y-2 relative">
                           {role.points.map((point, pIdx) => (
                              <div
                                 key={pIdx}
                                 className="group/item relative flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl bg-white/1.5 border border-white/4 transition-all duration-300 group-hover:border-white/[0.07] group-hover:bg-white/2.5"
                              >
                                 {/* Numbered Pipeline Node */}
                                 <div
                                    className={`relative z-10 w-7.5 h-7.5 rounded-lg font-mono text-xs font-semibold ${role.theme.iconBg} ${role.theme.iconBorder} ${role.theme.badgeText} border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 shadow-sm`}
                                 >
                                    0{pIdx + 1}
                                 </div>

                                 {/* Point Text */}
                                 <PrimaryBody
                                    text={point}
                                    className="text-zinc-300 text-sm sm:text-[15px] lg:text-[15px] 2xl:text-[15px] font-medium leading-snug group-hover:text-zinc-100 transition-colors duration-200 grow"
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Action Dock */}
                  <div className="relative z-10 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/6">
                     <Button
                        asChild
                        className={`group/btn w-full h-auto px-4 py-3 2xl:py-3.5 justify-between rounded-xl font-medium text-sm 2xl:text-base cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${role.theme.buttonClass}`}
                     >
                        <Link href={role.cta.href}>
                           <span>{role.cta.text}</span>
                           <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                     </Button>
                  </div>
               </motion.div>
            );
         })}
      </div>
   );
};

export default RoleCard;
