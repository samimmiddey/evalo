"use client"

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import TextContent from "./components/text-content";
import { ExpertCardsPreview } from "./components/expert-cards-preview";

const Hero = () => {
   return (
      <div className="-mt-16">
         <div className="relative hero-cover [&_.animate-first]:animation-duration-[60s] [&_.animate-second]:animation-duration-[65s] [&_.animate-third]:animation-duration-[70s] [&_.animate-fourth]:animation-duration-[75s] [&_.animate-fifth]:animation-duration-[80s]">
            <BackgroundGradientAnimation
               containerClassName="w-full h-auto min-h-0"
               gradientBackgroundStart="rgb(12, 10, 20)"
               gradientBackgroundEnd="rgb(8, 6, 18)"
               firstColor="124, 58, 237"     // violet-600
               secondColor="139, 92, 246"    // violet-500
               thirdColor="168, 85, 247"     // purple-500
               fourthColor="79, 70, 229"     // indigo-600
               fifthColor="109, 40, 217"     // violet-700
               pointerColor="139, 92, 246"   // violet-500
            >
               <div className="mt-15 2xl:mt-16 s-padding relative z-20">
                  <div className="container">
                     <TextContent />
                     <ExpertCardsPreview />
                  </div>
               </div>
            </BackgroundGradientAnimation>
         </div>
      </div>
   );
};

export default Hero;
