"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Video, FileText } from "lucide-react";
import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import SecondaryTitle from "@/components/common/secondary-title";
import { homeData } from "@/data/home/home.data";
import { Button } from "@/components/ui/button";
import HeaderLayout from "@/components/layouts/header-layout";

const STEPS = [
   {
      number: "01",
      icon: Users,
      title: "Choose Your Mentor",
      desc: "Browse verified senior engineers and leaders from top tech companies.",
      tag: "FAANG+ Mentors",
   },
   {
      number: "02",
      icon: Video,
      title: "Live 1-on-1 Interview",
      desc: "Practice in a realistic video & persistent chat environment.",
      tag: "45-Min Mock",
      active: true,
   },
   {
      number: "03",
      icon: FileText,
      title: "Actionable Feedback",
      desc: "Get a structured evaluation rubric with AI-driven performance breakdown.",
      tag: "Full Scorecard",
   },
];

const CTA = () => {
   return (
      <section className="s-margin-t container relative overflow-hidden">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 2xl:gap-20 items-center">

            {/* Left Column: Content & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-5 2xl:gap-6">
               <HeaderLayout className="items-start text-start mb-0!">
                  <HeaderText
                     icon={homeData.cta.icon}
                     text={homeData.cta.header}
                  />
                  <PrimaryTitle
                     text={homeData.cta.title}
                     className="text-left text-3xl sm:text-4xl lg:text-5xl 2xl:text-[56px] font-bold tracking-tight text-zinc-100 leading-[1.15]"
                  />
                  <PrimaryBody
                     text={homeData.cta.description}
                     className="text-left max-w-2xl"
                  />
               </HeaderLayout>

               {/* CTA Action Buttons */}
               <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link href="/dashboard">
                     <Button
                        size="xxl"
                        variant="white"
                        className="group/btn gap-2 font-semibold shadow-lg shadow-violet-500/15"
                     >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                     </Button>
                  </Link>
                  <Link href="/interviewers">
                     <Button
                        size="xxl"
                        variant="outline"
                        className="border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/6 text-zinc-200"
                     >
                        <span>Browse Mentors</span>
                     </Button>
                  </Link>
               </div>

               {/* Trust Highlights */}
               <div className="pt-2 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] 2xl:text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                     <span>Vetted FAANG+ Experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                     <span>Instant AI Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                     <span>No Commitment</span>
                  </div>
               </div>
            </div>

            {/* Right Column: Open Step Timeline Progression */}
            <div className="lg:col-span-5 relative w-full">
               {/* Connecting Timeline Vertical Line */}
               <div className="absolute left-5 top-7 bottom-15 w-px bg-white/10 pointer-events-none" />

               <div className="space-y-6 sm:space-y-8 relative z-10">
                  {STEPS.map((step, idx) => {
                     const Icon = step.icon;
                     return (
                        <motion.div
                           key={idx}
                           initial={{ opacity: 0, x: 20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ duration: 0.4, delay: idx * 0.1 }}
                           className="flex items-start gap-4 sm:gap-5 group"
                        >
                           {/* Step Node Icon */}
                           <div
                              className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 bg-surface-dark border-white/10 text-violet-300 group-hover:border-white/20 group-hover:text-zinc-200"
                           >
                              <Icon className="w-4.5 h-4.5" />
                           </div>

                           {/* Step Details */}
                           <div className="space-y-1 min-w-0 pt-0.5">
                              <div className="flex items-center gap-2.5">
                                 <SecondaryTitle
                                    text={step.title}
                                    className="text-base sm:text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors duration-200"
                                 />
                                 <span
                                    className="text-xs font-mono px-2 py-0.5 rounded-full border bg-surface-dark text-zinc-400 border-white/10"
                                 >
                                    {step.tag}
                                 </span>
                              </div>
                              <PrimaryBody
                                 text={step.desc}
                                 className="text-sm lg:text-[15px] 2xl:text-base text-zinc-400 leading-relaxed"
                              />
                           </div>
                        </motion.div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default CTA;
