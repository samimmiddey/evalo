import PrimaryTitle from '@/components/common/primary-title';
import PrimaryBody from '@/components/common/primary-body';
import { onboardingData } from '@/data/onboarding/onboarding.data';
import Logo from '@/components/common/logo';

const OnboardingHeader = () => {
   const data = onboardingData.header;

   return (
      <div className="space-y-4 text-left">
         {/* Step Indicator & Brand */}
         <div className="flex items-center justify-between">
            <Logo containerClassName='scale-110 2xl:scale-120' />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/25 text-zinc-300 text-xs font-medium backdrop-blur-md">
               <data.btnIcon className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
               <span>{data.btnText}</span>
            </div>
         </div>

         <div className="space-y-3 2xl:space-y-4">
            <PrimaryTitle
               text={data.title}
               className="font-bold tracking-tight text-3xl! lg:text-4xl! 2xl:text-[40px]!"
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



