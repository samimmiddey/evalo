"use client";

import { exploreData } from "@/data/explore/explore.data";
import { Telescope } from "lucide-react";
import { motion } from "motion/react";
import HeaderText from "@/components/common/header-text";
import { Button } from "@/components/ui/button";

const TextContent = () => {
   return (
      <div className="flex flex-col items-center text-center relative z-10">
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-4 2xl:mb-5"
         >
            <HeaderText icon={Telescope} text={exploreData.hero.header} />
         </motion.div>

         <h1 className="mx-auto w-full md:max-w-xl lg:max-w-2xl 2xl:max-w-4xl text-center text-5xl md:text-[54px] font-bold lg:text-6xl 2xl:text-[80px] text-gray-100 font-outfit leading-[1.1] tracking-tight pb-2">
            {exploreData.hero.title.split(" ").map((word, index) => (
               <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                     duration: 0.3,
                     delay: index * 0.08,
                     ease: "easeInOut",
                  }}
                  className="mr-3 inline-block"
               >
                  {word}
               </motion.span>
            ))}
         </h1>

         <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="mx-auto max-w-full md:max-w-xl lg:max-w-2xl 2xl:max-w-3xl mt-1 py-4 text-center text-[15px] 2xl:text-lg font-normal text-gray-300"
         >
            {exploreData.hero.description}
         </motion.p>

         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.95 }}
            className="mt-4 lg:mt-5 2xl:mt-6 flex flex-wrap items-center justify-center gap-2.5 md:gap-3 2xl:gap-4"
         >
            <Button size="xxl" variant="white">
               Start Exploring
            </Button>
            <Button size="xxl" variant="outline">
               How It Works
            </Button>
         </motion.div>
      </div>
   );
};

export default TextContent;
