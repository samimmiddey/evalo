"use client";

import { motion } from 'motion/react';
import { Check, Sparkles } from 'lucide-react';
import { CheckoutButton, useSubscription } from '@clerk/nextjs/experimental';
import { Plan } from '../models/pricing.types';
import { Button } from '@/components/ui/button';
import { Show } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
   i: number;
   plan: Plan;
}

const PricingCard = ({ i, plan }: PricingCardProps) => {
   const { data: subscription, revalidate } = useSubscription();

   const router = useRouter();

   const activeSubscription = subscription?.subscriptionItems.find(
      (item) => item.status === "active"
   );

   const upcomingSubscription = subscription?.subscriptionItems.find(
      (item) => item.status === "upcoming"
   );

   const isCurrentPlan = activeSubscription?.plan.id === plan.id;
   const isUpcomingPlan = upcomingSubscription?.plan.id === plan.id;

   const isPopular = plan.name === "Starter";

   return (
      <motion.div
         key={i}
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, margin: "-50px", amount: 0.1 }}
         transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
         className={`group relative flex flex-col h-full rounded-3xl bg-surface-dark/90 border transition-all duration-500 hover:-translate-y-2 
         ${isPopular
               ? 'border-violet-500/50 shadow-glow-violet scale-100 lg:scale-105 z-10'
               : 'border-white/5 hover:border-violet-500/30 mt-0 lg:mt-4'}`}
      >
         {/* Top Gradient Wash */}
         {isPopular && <div className="absolute inset-0 bg-linear-to-b from-violet-600/20 via-transparent to-transparent opacity-50 pointer-events-none rounded-3xl" />}

         {/* Ambient Glow */}
         {isPopular && <div className="absolute top-0 right-25 lg:right-0 h-[200px] lg:h-[300px] 2xl:w-[400px] w-[200px] lg:w-[300px] 2xl:h-[400px] rounded-full blur-[100px] bg-violet-500/20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />}

         <div className="relative z-10 flex flex-col grow p-7 lg:p-7.5 2xl:p-9">
            {isPopular && (
               <div className="absolute top-0 right-8 -translate-y-1/2 px-3.5 2xl:px-4 py-1.5 bg-violet-500 text-white text-[11px] 2xl:text-xs font-bold uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
               </div>
            )}

            <h3 className={`text-2xl 2xl:text-3xl font-bold font-outfit mb-3 2xl:mb-4 ${isPopular ? 'text-white' : 'text-gray-200'}`}>
               {plan.name}
            </h3>

            <p className="text-gray-400 font-inter text-sm 2xl:text-base mb-5 2xl:mb-6">
               {plan.description}
            </p>

            <div className="mb-5 lg:mb-6 2xl:mb-7">
               <div className="flex items-end gap-1">
                  <span className="text-4xl 2xl:text-5xl font-bold font-outfit text-white">
                     {plan.fee?.currencySymbol}{plan.fee?.amountFormatted}
                  </span>
                  <span className="text-gray-400 mb-1 font-medium text-sm 2xl:text-base">/month</span>
               </div>
            </div>

            {/* Checkout Button when signed out */}
            <Show when='signed-out'>
               <Button
                  className={`w-full h-auto py-3.25 2xl:py-3.75 rounded-xl font-semibold font-outfit tracking-wide transition-all duration-300 mb-8 lg:mb-9 
                     ${isPopular
                        ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                        : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10"
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
               <CheckoutButton
                  for="user"
                  planId={plan.id}
                  planPeriod="month"
                  onSubscriptionComplete={async () => {
                     await revalidate();
                  }}
                  checkoutProps={{
                     appearance: {
                        elements: {
                           drawerRoot: {
                              zIndex: 9999
                           },
                           drawerBackdrop: {
                              zIndex: 9999,
                              backgroundColor: "rgba(0, 0, 0, 0.75)"

                           },

                        },
                        variables: {
                           colorPrimary: "#8e51ff",
                           colorPrimaryForeground: "#FFFFFF",
                           colorBackground: "#18181B",
                           colorForeground: "#F8FAFC",
                           colorInput: "#2D2D31",
                           colorInputForeground: "#FAFAFA",
                           colorBorder: "#94A3B8",
                           colorNeutral: "#CBD5E1",
                           colorMuted: "#3A3A40",
                           colorMutedForeground: "#E4E4E7",
                           colorRing: "#8e51ff",
                           colorShadow: "rgba(0,0,0,0.45)",
                           borderRadius: "12px",
                           fontFamily: "Inter, sans-serif",
                        }
                     },
                  }}
               >
                  <Button
                     disabled={isCurrentPlan || isUpcomingPlan}
                     className={`w-full h-auto py-3.25 2xl:py-3.75 rounded-xl font-semibold font-outfit tracking-wide transition-all duration-300 mb-8 lg:mb-9
    ${isCurrentPlan
                           ? "bg-green-500/15 hover:bg-green-500/20 text-gray-200 border border-green-500/30"
                           : isUpcomingPlan
                              ? "bg-sky-500/15 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : isPopular
                                 ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                                 : "bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10"
                        }`}
                  >
                     {isCurrentPlan
                        ? "Current Plan"
                        : isUpcomingPlan
                           ? "Scheduled"
                           : activeSubscription
                              ? "Switch Plan"
                              : "Subscribe"}
                  </Button>


               </CheckoutButton>
            </Show>

            {isUpcomingPlan && (
               <p className="mt-2 text-center text-xs text-sky-300">
                  Starts {upcomingSubscription.periodStart.toLocaleDateString()}
               </p>
            )}

            {isCurrentPlan && activeSubscription?.periodEnd && (
               <p className="mt-2 text-center text-xs text-gray-400">
                  Renews {activeSubscription.periodEnd.toLocaleDateString()}
               </p>
            )}

            <div className="space-y-4">
               <p className="text-xs 2xl:text-sm font-semibold text-gray-100 uppercase tracking-wider mb-4.5 2xl:mb-5">What&apos;s included</p>
               {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 2xl:gap-3.5">
                     <div className={`p-1 rounded-full shrink-0 ${isPopular ? 'bg-violet-500/30 text-violet-400' : 'bg-white/10 text-gray-400'}`}>
                        <Check className="h-3 2xl:w-3.5 w-3 2xl:h-3.5" strokeWidth={3} />
                     </div>
                     <span className="text-gray-300 font-inter text-sm 2xl:text-base">{feature.name}</span>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>
   );
};

export default PricingCard;
