import { ReactNode } from 'react';

interface Props {
   children: ReactNode;
}

export default function OnboardingContainer({ children }: Props) {
   return (
      <div className="w-full max-w-xl 2xl:max-w-2xl mx-auto rounded-3xl border border-white/5 bg-[#151926] backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.7),0_0_50px_rgba(124,58,237,0.15)] overflow-hidden relative transition-all duration-300">
         <div className="p-6 md:p-7 2xl:p-8 flex flex-col relative z-10">
            <div className="w-full space-y-5 2xl:space-y-6">
               {children}
            </div>
         </div>
      </div>
   );
}



