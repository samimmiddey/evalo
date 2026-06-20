"use client"

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import TextContent from './components/text-content'
import { TerminalCard } from './components/terminal-card'

const Hero = () => {
   return (
      <div className="-mt-16">
         <div className="relative hero-cover [&_.animate-first]:animation-duration-[60s] [&_.animate-second]:animation-duration-[65s] [&_.animate-third]:animation-duration-[70s] [&_.animate-fourth]:animation-duration-[75s] [&_.animate-fifth]:animation-duration-[80s]">
            <BackgroundGradientAnimation
               containerClassName='w-full h-auto min-h-0'
               gradientBackgroundStart='rgb(15, 15, 20)'
               gradientBackgroundEnd='rgb(10, 10, 15)'
               firstColor="139, 92, 246"     // violet-500
               secondColor="217, 70, 239"    // fuchsia-500
               thirdColor="124, 58, 237"     // violet-600
               fourthColor="59, 130, 246"    // blue-500
               fifthColor="109, 40, 217"     // violet-700
               pointerColor="139, 92, 246"   // violet-500
            >
               <div className="mt-15 2xl:mt-16 s-padding relative z-20">
                  <div className="container">
                     <TextContent />
                     <TerminalCard />
                  </div>
               </div>
            </BackgroundGradientAnimation>
         </div>
      </div>
   )
}

export default Hero