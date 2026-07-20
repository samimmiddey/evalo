"use client";

import TextContent from "./components/text-content";
import { ExpertCardsPreview } from "./components/expert-cards-preview";

const Hero = () => {
   return (
      <div className="-mt-16 relative overflow-hidden bg-[#0A0812]">
         {/* Premium geometric grid pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size[32px_32px] pointer-events-none" />

         {/* Elegant mask to fade grid edges */}
         <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#0A0812]/50 to-[#0A0812] pointer-events-none" />

         {/* Rich radial ambient glows for inner page depth */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-87.5 rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
         <div className="absolute top-12 left-1/2 -translate-x-1/2 w-225 h-112.5 rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

         {/* Subtle top border highlight */}
         <div className="absolute top-16 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/20 to-transparent pointer-events-none" />

         <div className="mt-15 2xl:mt-16 s-padding relative z-20">
            <div className="container">
               <TextContent />
               <ExpertCardsPreview />
            </div>
         </div>
      </div>
   );
};

export default Hero;
