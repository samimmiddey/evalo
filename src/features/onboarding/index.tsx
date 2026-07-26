'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardingContainer from './components/onboarding-container';
import OnboardingHeader from './components/onboarding-header';
import IntervieweeTab from './components/interviewee-tab';
import InterviewerTab from './components/interviewer-tab';
import { FormProvider, useForm } from 'react-hook-form';
import { onboardingSchema, OnboardingSchemaTypes } from './schemas/onboarding.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { defaultValues, onboardingData } from '@/data/onboarding/onboarding.data';
import { Role } from '@/data/onboarding/onboardiong.types';
import { useMutation } from '@/hooks/use-mutation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CustomSpinner from '@/components/common/custom-spinner';
import { onboardUser } from './services/client/onboarding.service';
import { useSession } from '@clerk/nextjs';

const Onboarding = () => {
   const { session } = useSession();
   const router = useRouter();

   const { isPending, data, error, mutate: mutateOnboard } = useMutation(onboardUser);

   const methods = useForm<OnboardingSchemaTypes>({
      resolver: zodResolver(onboardingSchema),
      defaultValues
   });

   // Submit onboarding form
   const onFormSubmit = async (data: OnboardingSchemaTypes) => {
      await mutateOnboard(data);
   };

   useEffect(() => {
      if (error) {
         toast.error(error);
      }

      if (data) {
         toast.success('Your profile has been set up successfully!');
         void session?.reload().then(() => {
            router.push('/dashboard');
         });
      }
   }, [error, data]);

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
               <FormProvider {...methods}>
                  <form
                     onSubmit={e => {
                        void methods.handleSubmit(onFormSubmit)(e);
                     }}
                  >
                     <Tabs
                        value={methods.watch('role')}
                        onValueChange={(val) => methods.setValue('role', val as Role)}
                        className="w-full space-y-4"
                     >
                        <TabsList className="w-full grid grid-cols-2 h-12! bg-zinc-950/60 p-1 rounded-xl border border-white/10">
                           {
                              onboardingData.tabs.map((tab) => {
                                 return (
                                    <TabsTrigger
                                       key={tab.value}
                                       value={tab.value}
                                       className="h-full rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-pointer data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 data-[state=active]:border-violet-500/40 transition-all"
                                    >
                                       <tab.icon className="w-4 h-4 text-violet-300" />
                                       <span>{tab.text}</span>
                                    </TabsTrigger>
                                 );
                              })
                           }
                        </TabsList>
                        <TabsContent value={onboardingData.tabs[0].value} className="mt-0 mb-2 focus-visible:outline-none">
                           <IntervieweeTab />
                        </TabsContent>

                        <TabsContent value={onboardingData.tabs[1].value} className="mt-0 mb-2 focus-visible:outline-none">
                           <InterviewerTab />
                        </TabsContent>
                     </Tabs>

                     {/* CTA */}
                     <Button
                        className="w-full h-11 rounded-lg flex items-center justify-center gap-2 group transition-all mt-4 mb-2"
                        size="lg"
                        type="submit"
                        variant='white'
                        disabled={isPending}
                     >
                        {
                           isPending ? (
                              <>
                                 <CustomSpinner
                                    text='Submitting...'
                                    spinnerClass='text-gray-700'
                                    textClass='text-gray-700'
                                 />
                              </>
                           ) : (
                              <>
                                 <span>{onboardingData.formBtnText}</span>
                                 <onboardingData.formBtnIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                           )
                        }
                     </Button>
                  </form>
               </FormProvider>

            </OnboardingContainer>
         </div>
      </div>
   );
};

export default Onboarding;