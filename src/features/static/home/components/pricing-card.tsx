"use client";

import { motion } from 'motion/react';
import { Check, Gem, IndianRupee } from 'lucide-react';
import { CustomPlan } from '../types/pricing.types';
import { Button } from '@/components/ui/button';
import { Show } from '@clerk/nextjs';
import { useRouter } from 'nextjs-toploader/app';

interface PricingCardProps {
   i: number;
   plan: CustomPlan;
   disableAnimation?: boolean;
   currentPlan?: string;
   role?: string;
}

const PricingCard = ({ i, plan, disableAnimation = false, currentPlan, role }: PricingCardProps) => {
   const router = useRouter();

   const hasActivePaidPlan = Boolean(currentPlan && currentPlan.toLowerCase() !== 'free');
   const isCurrentPlan = currentPlan?.toLowerCase() === plan.name.toLowerCase();
   const isPopular = plan.name === "Starter";

   return (
      <motion.div
         key={i}
         initial={disableAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={disableAnimation ? { duration: 0 } : { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
         className={`group relative flex flex-col h-full rounded-3xl bg-surface-dark/90 border transition-all duration-500 ${disableAnimation ? '' : 'hover:-translate-y-2'} 
         ${isPopular
               ? 'border-violet-500/50 shadow-glow-violet scale-100 lg:scale-105 z-10'
               : 'border-white/5 hover:border-violet-500/30 mt-0 lg:mt-4'}`}
      >
         {/* Top Gradient Wash */}
         {isPopular && <div className="absolute inset-0 bg-linear-to-b from-violet-600/20 via-transparent to-transparent opacity-50 pointer-events-none rounded-3xl" />}

         {/* Ambient Glow */}
         {isPopular && <div className="absolute top-0 right-25 lg:right-0 h-50 lg:h-75 2xl:w-100 w-50 lg:w-75 2xl:h-100 rounded-full blur-[100px] bg-violet-500/20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />}

         <div className="relative z-10 flex flex-col grow p-7 lg:p-7.5 2xl:p-9">
            {isPopular && (
               <div className="absolute top-0 right-8 -translate-y-1/2 px-3 2xl:px-3.5 py-1.5 bg-violet-500 text-zinc-100 text-[11px] 2xl:text-xs font-semibold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 font-geist">
                  <Gem className="w-3.5 h-3.5" /> Most Popular
               </div>
            )}

            <h3 className={`text-lg lg:text-xl 2xl:text-2xl font-semibold font-geist mb-2 2xl:mb-3 ${isPopular ? 'text-zinc-100' : 'text-zinc-200'}`}>
               {plan.name}
            </h3>

            <p className="text-zinc-400 text-sm 2xl:text-base mb-4 2xl:mb-5">
               {plan.description}
            </p>

            <div className="mb-5 lg:mb-5.5 2xl:mb-6">
               <div className="flex items-end gap-1">
                  <span className="text-3xl 2xl:text-[42px] font-bold font-geist text-zinc-100 flex items-center">
                     <IndianRupee className='h-9 w-9' />{plan.amount}
                  </span>
                  <span className="text-zinc-400 mb-1 2xl:mb-1.5 font-medium text-sm 2xl:text-base">/month</span>
               </div>
            </div>

            {/* Checkout Button when signed out */}
            <Show when='signed-out'>
               <Button
                  className={`w-full h-auto py-3.25 2xl:py-3.75 rounded-xl font-semibold tracking-wide transition-all duration-300 mb-7 2xl:mb-8 
                     ${isPopular
                        ? "bg-violet-600 hover:bg-violet-500 text-zinc-100"
                        : "bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10"
                     }`}
                  onClick={() => {
                     router.push('/sign-in');
                  }}
               >
                  Get Started
               </Button>
            </Show>

            {/* Checkout Button when signed in */}
            <Show when="signed-in">
               <Button
                  disabled={isCurrentPlan || plan.id === 'free' || role === 'INTERVIEWER'}
                  className={`w-full h-auto py-3.25 2xl:py-3.75 rounded-xl font-semibold font-geist tracking-wide transition-all duration-300 mb-7 2xl:mb-8
                  ${isCurrentPlan
                        ? "bg-emerald-500/15 hover:bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                        : isPopular
                           ? "bg-violet-600 hover:bg-violet-500 text-zinc-100"
                           : "bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10"
                     }`}
               >
                  {isCurrentPlan
                     ? "Current Plan"
                     : hasActivePaidPlan
                        ? "Switch Plan"
                        : "Subscribe"}
               </Button>
            </Show>

            <div className="space-y-4">
               <p className="text-[13px] sm:text-sm font-mono font-semibold tracking-wider text-zinc-400 uppercase mb-4.5 2xl:mb-5">What&apos;s included</p>
               {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 2xl:gap-3.5">
                     <div className={`p-1 rounded-full shrink-0 ${isPopular ? 'bg-violet-500/30 text-violet-400' : 'bg-white/10 text-zinc-400'}`}>
                        <Check className="h-3 2xl:w-3.5 w-3 2xl:h-3.5" strokeWidth={3} />
                     </div>
                     <span className="text-zinc-300 text-sm 2xl:text-base">{feature}</span>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>
   );
};

export default PricingCard;
