import { ReactNode } from 'react';

interface Props {
   children: ReactNode;
}

export default function OnboardingContainer({ children }: Props) {
   return (
      <div className="w-full max-w-xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/85 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.7),0_0_50px_rgba(124,58,237,0.15)] overflow-hidden relative transition-all duration-300">
         {/* Top ambient highlight line */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1.5px] bg-linear-to-r from-transparent via-violet-500 to-transparent opacity-80" />

         {/* Corner blur accents */}
         <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

         <div className="p-6 md:p-8 2xl:p-8 flex flex-col relative z-10">
            <div className="w-full space-y-5 2xl:space-y-6">
               {children}
            </div>
         </div>
      </div>
   );
}



