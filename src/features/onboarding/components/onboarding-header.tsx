import PrimaryTitle from '@/components/common/primary-title';
import PrimaryBody from '@/components/common/primary-body';
import { onboardingData } from '@/data/onboarding/onboarding.data';

const OnboardingHeader = () => {
   const data = onboardingData.header;

   return (
      <div className="space-y-4 text-left">
         {/* Step Indicator & Brand */}
         <div className="flex items-center justify-between">
            <span className="font-lobster font-bold text-2xl 2xl:text-3xl bg-linear-to-r from-violet-200 via-violet-300 to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
               Evalo
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-medium backdrop-blur-md">
               <data.btnIcon className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
               <span>{data.btnText}</span>
            </div>
         </div>

         <div className="space-y-3 2xl:space-y-4">
            <PrimaryTitle
               text={data.title}
               className="font-bold tracking-tight"
            />
            <PrimaryBody
               className="text-sm! 2xl:text-base!"
               text={data.description}
            />
         </div>
      </div>
   );
};

export default OnboardingHeader;



