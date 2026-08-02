import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientWrapperProps {
   children: ReactNode;
   className?: string;
   showGrid?: boolean;
}

const GradientWrapper = ({ children, className, showGrid = true }: GradientWrapperProps) => {
   return (
      <div className={cn("relative min-h-screen bg-[#0e111a] overflow-hidden", className)}>
         <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full">
            {/* Smooth SVG gradients with subtle noise filter to eliminate color banding and create a velvety finish */}
            <svg className="absolute inset-0 w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
               <defs>
                  {/* Top-Right Glow */}
                  <radialGradient id="top-right-glow" cx="95%" cy="5%" r="60%">
                     <stop offset="0%" stopColor="rgba(139, 92, 246, 0.15)" />
                     <stop offset="50%" stopColor="rgba(99, 102, 241, 0.05)" />
                     <stop offset="100%" stopColor="rgba(14, 17, 26, 0)" />
                  </radialGradient>

                  {/* Bottom-Left Glow */}
                  <radialGradient id="bottom-left-glow" cx="5%" cy="95%" r="60%">
                     <stop offset="0%" stopColor="rgba(219, 39, 119, 0.15)" />
                     <stop offset="50%" stopColor="rgba(139, 92, 246, 0.05)" />
                     <stop offset="100%" stopColor="rgba(14, 17, 26, 0)" />
                  </radialGradient>

                  {/* Noise Texture to dither gradients and prevent banding */}
                  <filter id="noise-dither">
                     <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                     <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.025 0" />
                  </filter>
               </defs>

               {/* Gradient fills */}
               <rect width="100%" height="100%" fill="url(#top-right-glow)" />
               <rect width="100%" height="100%" fill="url(#bottom-left-glow)" />

               {/* Noise Overlay */}
               <rect width="100%" height="100%" filter="url(#noise-dither)" />
            </svg>

            {/* Premium, ultra-thin dotted grid overlay */}
            {showGrid && <div className="absolute inset-0 bg-[radial-gradient(#222f44_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-40" />}
         </div>
         {children}
      </div>
   );
};

export default GradientWrapper;

