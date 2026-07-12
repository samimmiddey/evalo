"use client";

import AuthBranding from "./auth-branding";
import { ReactNode } from "react";

interface Props {
   children: ReactNode;
}

export default function AuthContainer({ children }: Props) {
   return (
      <div className="w-full flex items-center justify-center bg-background 2xl:p-8">
         <div className="w-full max-w-[1000px] h-full flex flex-col md:flex-row rounded-2xl md:rounded-3xl border border-border/40 shadow-2xl bg-card overflow-hidden">

            {/* Left Column - Branding */}
            <AuthBranding />

            {/* Right Column - Form */}
            <div className="w-full md:w-1/2 max-sm:px-6 max-sm:py-7 sm:p-8 lg:p-10 2xl:p-12 flex flex-col justify-center relative">
               <div className="w-full md:max-w-sm mx-auto space-y-6 md:space-y-8 relative z-10">
                  {children}
               </div>
            </div>

         </div>
      </div>
   );
}
