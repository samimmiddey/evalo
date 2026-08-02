"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthBranding from "./auth-branding";

interface Props {
   children: ReactNode;
}

export default function AuthContainer({ children }: Props) {
   return (
      <div className="relative min-h-screen w-full flex flex-col lg:grid lg:grid-cols-12 bg-background overflow-x-hidden">
         {/* Circular Go Back Button */}
         <Link
            href="/"
            className="absolute top-5 left-5 z-50 flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-foreground transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Go back to home"
         >
            <ArrowLeft className="size-5" />
         </Link>

         {/* Left Side: Visual / Branding Area (~7fr -> lg:col-span-7) */}
         <div className="hidden lg:flex lg:col-span-7 h-full">
            <AuthBranding />
         </div>

         {/* Right Side: Auth Form (~5fr -> lg:col-span-5) with no background color */}
         <div className="w-full lg:col-span-5 min-h-screen flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10 bg-transparent">
            <div className="w-full max-w-md mx-auto space-y-6 md:space-y-8">
               {children}
            </div>
         </div>
      </div>
   );
}
