'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase } from 'lucide-react';
import OnboardingContainer from './components/onboarding-container';
import OnboardingHeader from './components/onboarding-header';
import IntervieweeTab from './components/interviewee-tab';
import InterviewerTab from './components/interviewer-tab';

const Onboarding = () => {
   const [activeRole, setActiveRole] = useState<'interviewee' | 'interviewer'>('interviewee');

   return (
      <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10 overflow-hidden">

         {/* Background glow orbs */}
         <div className="absolute inset-0 z-0 pointer-events-none isolate">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.12] mix-blend-soft-light" />
            <div className="absolute top-[-25%] left-[-15%] w-[65%] h-[65%] rounded-full bg-violet-600/20 blur-[150px]" />
            <div className="absolute bottom-[-25%] right-[-15%] w-[65%] h-[65%] rounded-full bg-fuchsia-600/20 blur-[150px]" />
         </div>

         {/* Grid pattern */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_75%_75%_at_50%_50%,black_65%,transparent_100%)] z-0 opacity-40" />

         {/* Onboarding Container */}
         <div className="relative z-10 w-full">
            <OnboardingContainer>

               {/* Header */}
               <OnboardingHeader />

               {/* Role tabs */}
               <Tabs
                  value={activeRole}
                  onValueChange={(val) => setActiveRole(val as 'interviewee' | 'interviewer')}
                  className="w-full space-y-4"
               >
                  <TabsList className="w-full grid grid-cols-2 h-12! bg-zinc-950/60 p-1 rounded-xl border border-white/10">
                     <TabsTrigger
                        value="interviewee"
                        className="h-full rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-pointer data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 data-[state=active]:border-violet-500/40 transition-all"
                     >
                        <User className="w-4 h-4 text-violet-300" />
                        <span>Interviewee</span>
                     </TabsTrigger>

                     <TabsTrigger
                        value="interviewer"
                        className="h-full rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-pointer data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 data-[state=active]:border-violet-500/40 transition-all"
                     >
                        <Briefcase className="w-4 h-4 text-violet-300" />
                        <span className='font-inter'>Interviewer</span>
                     </TabsTrigger>
                  </TabsList>


                  <TabsContent value="interviewee" className="mt-0 mb-2 focus-visible:outline-none">
                     <IntervieweeTab
                        onChangeRole={() => setActiveRole('interviewer')}
                     />
                  </TabsContent>

                  <TabsContent value="interviewer" className="mt-0 mb-2 focus-visible:outline-none">
                     <InterviewerTab
                        onChangeRole={() => setActiveRole('interviewee')}
                     />
                  </TabsContent>
               </Tabs>

            </OnboardingContainer>
         </div>
      </div>
   );
};

export default Onboarding;