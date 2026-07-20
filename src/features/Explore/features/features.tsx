"use client"

import HeaderText from "@/components/common/header-text";
import PrimaryBody from "@/components/common/primary-body";
import PrimaryTitle from "@/components/common/primary-title";
import { exploreData } from "@/data/explore/explore.data";
import FeatureRow from "./components/feature-card";
import { motion } from "motion/react";

const Features = () => {
   return (
      <div className="s-margin-t container">
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 2xl:gap-20 items-start">

            {/* Left: Sticky section header */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.5, ease: "easeOut" }}
               className="lg:sticky lg:top-28 flex flex-col items-start gap-4 lg:gap-5 2xl:gap-6"
            >
               <HeaderText
                  icon={exploreData.features.icon}
                  text={exploreData.features.header}
               />
               <PrimaryTitle
                  text={exploreData.features.title}
                  className="text-left mt-0"
               />
               <PrimaryBody
                  text={exploreData.features.description}
                  className="text-left"
               />
            </motion.div>

            {/* Right: Numbered feature rows */}
            <div className="flex flex-col divide-y-0 border-t border-white/5">
               {exploreData.features.cards.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                     <FeatureRow
                        key={i}
                        i={i}
                        feature={feature}
                        Icon={Icon}
                     />
                  );
               })}
            </div>

         </div>
      </div>
   );
};

export default Features;
