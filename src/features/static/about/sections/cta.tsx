"use client";

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import { aboutData } from "@/data/about/about.data";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Search, Star, Users } from "lucide-react";
import Link from "next/link";

const CTA = () => {
   return (
      <div className="s-margin-t s-margin-b container">
         <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative rounded-3xl overflow-hidden border border-white/8"
            style={{
               background: "linear-gradient(135deg, #0d0a1a 0%, #100d20 50%, #0a0d1a 100%)",
            }}
         >
            {/* Dot grid overlay */}
            <div
               className="absolute inset-0 opacity-40"
               style={{
                  backgroundImage:
                     "radial-gradient(circle, rgba(139,92,246,0.25) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
               }}
            />

            {/* Corner glow */}
            <div className="absolute top-0 right-0 w-md h-md bg-violet-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-fuchsia-500/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-stretch">

               {/* Left: Content */}
               <div className="flex flex-col justify-between gap-8 p-8 lg:p-12 2xl:p-16">
                  <div className="flex flex-col items-start gap-4 2xl:gap-5">
                     <HeaderText
                        icon={aboutData.cta.icon}
                        text={aboutData.cta.header}
                     />
                     <PrimaryTitle
                        text={aboutData.cta.title}
                        className="text-left mt-0 text-zinc-100 max-w-xl"
                     />
                     <PrimaryBody
                        text={aboutData.cta.description}
                        className="text-left text-zinc-400 max-w-lg"
                     />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 2xl:gap-4">
                     <Link href='/dashboard'>
                        <Button size="xxl" variant="white">
                           Start Exploring
                        </Button>
                     </Link>
                     <Link href='/dashboard/interviewers'>
                        <Button size="xxl" variant="outline">
                           Browse Experts
                        </Button>
                     </Link>
                  </div>
               </div>

               {/* Right: Stats panel */}
               <div className="flex flex-col justify-center divide-y divide-white/5 border-t border-white/5 lg:border-t-0 lg:border-l lg:border-white/5 min-w-50 2xl:min-w-60">
                  {[
                     { Icon: Users, value: "2,400+", label: "Experts" },
                     { Icon: Star, value: "4.9 / 5", label: "Rating" },
                     { Icon: Search, value: "<1 min", label: "To match" },
                  ].map(({ Icon, value, label }, i) => (
                     <div
                        key={i}
                        className="flex flex-row lg:flex-col items-center lg:items-start gap-3 lg:gap-2 px-8 lg:px-10 py-5 lg:py-7 2xl:py-8"
                     >
                        <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                        <p className="font-outfit font-bold text-xl 2xl:text-2xl text-zinc-100 leading-none">
                           {value}
                        </p>
                        <p className="font-inter text-xs text-zinc-500 lg:mt-0.5">
                           {label}
                        </p>
                     </div>
                  ))}
               </div>

            </div>
         </motion.div>
      </div>
   );
};

export default CTA;
