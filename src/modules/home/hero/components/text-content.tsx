import { Button } from '@/components/ui/button';
import { Sparkle } from 'lucide-react';
import { motion } from "motion/react";

const TextContent = () => {
   return (
      <div className='flex flex-col items-center text-center relative z-10'>
         <motion.div
            initial={{
               opacity: 0,
            }}
            animate={{
               opacity: 1,
            }}
            transition={{
               duration: 0.3,
               delay: 0.1,
            }}
            className='mb-4 2xl:mb-5'
         >
            <Button
               variant="outline"
               size="lg"
               className='border-violet-400/25! bg-violet-600/15! text-violet-300 hover:translate-y-0 font-lobster text-[15px] 2xl:text-lg gap-2 max-sm:px-3'
            >
               <Sparkle />
               Go beyond the surface to evaluate true potential
            </Button>
         </motion.div>
         <h1 className="mx-auto w-full md:max-w-xl lg:max-w-2xl 2xl:max-w-4xl text-center text-4xl sm:text-5xl font-semibold lg:text-6xl 2xl:text-7xl text-violet-100 font-outfit leading-[1.05]">
            {"Ace your next interview with real experts"
               .split(" ")
               .map((word, index) => (
                  <motion.span
                     key={index}
                     initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                     animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                     transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        ease: "easeInOut",
                     }}
                     className="mr-2 inline-block"
                  >
                     {word}
                  </motion.span>
               ))}
         </h1>
         <motion.p
            initial={{
               opacity: 0,
            }}
            animate={{
               opacity: 1,
            }}
            transition={{
               duration: 0.3,
               delay: 0.8,
            }}
            className="mx-auto max-w-full md:max-w-xl lg:max-w-2xl 2xl:max-w-3xl mt-1 py-4 text-center text-[15px] 2xl:text-lg font-normal text-slate-300"
         >
            Book 1:1 mock interviews with senior engineers from top companies. Get AI powered feedback, role-specific questions, and the confidence to land yout dream job.
         </motion.p>
         <motion.div
            initial={{
               opacity: 0,
            }}
            animate={{
               opacity: 1,
            }}
            transition={{
               duration: 0.3,
               delay: 1,
            }}
            className="mt-4 lg:mt-5 2xl:mt-6 flex flex-wrap items-center justify-center gap-2.5 md:gap-3 2xl:gap-4"
         >
            <Button size="xxl" variant="white">Get Started</Button>
            <Button size="xxl" variant="outline">Browse Interviews</Button>
         </motion.div>
      </div>
   )
}

export default TextContent