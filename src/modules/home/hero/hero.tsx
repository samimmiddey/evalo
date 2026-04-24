"use client"

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import TextContent from './components/text-content'
import { TerminalCard } from './components/terminal-card'

const Hero = () => {
   return (
      <div className="-mt-15 2xl:-mt-16">
         <div className="relative hero-cover">
            <BackgroundGradientAnimation
               containerClassName='w-full h-auto min-h-0'
               gradientBackgroundStart='#9810f25'
               gradientBackgroundEnd='#ffb9025'
               firstColor="14, 90, 204"
               secondColor="177, 59, 204"
               thirdColor="80, 176, 204"
               fourthColor="160, 40, 40"
               fifthColor="144, 144, 40"
               pointerColor="112, 80, 204"
            >
               <div className="mt-15 2xl:mt-16 s-padding">
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