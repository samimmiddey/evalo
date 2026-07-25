import PrimaryTitle from '@/components/common/primary-title';
import PrimaryBody from '@/components/common/primary-body';
import { User } from 'lucide-react';

const OnboardingHeader = () => {
   return (
      <div className="space-y-4 text-left">
         {/* Step Indicator & Brand */}
         <div className="flex items-center justify-between">
            <span className="font-lobster font-bold text-2xl 2xl:text-3xl bg-linear-to-r from-violet-200 via-violet-300 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
               Evalo
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium backdrop-blur-md">
               <User className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
               <span>Profile Setup</span>
            </div>
         </div>

         <div className="space-y-3 2xl:space-y-4">
            <PrimaryTitle
               text="Set up your profile"
               className="font-bold tracking-tight"
            />
            <PrimaryBody
               className="text-sm! 2xl:text-base!"
               text="We'd love to get to know you. Tell us a little about yourself so we can personalize your experience."
            />
         </div>
      </div>
   );
};

export default OnboardingHeader;



