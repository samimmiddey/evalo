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
import { AssignedRole } from '@/types/user.types';
import { useMutation } from '@/hooks/use-mutation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CustomSpinner from '@/components/common/custom-spinner';
import { onboardUser } from './services/client/onboarding.client.service';
import { useRoleBasedRedirect } from '@/hooks/use-role-based-redirect';
import GradientWrapper from '@/components/wrappers/gradient-wrapper';

const Onboarding = () => {
   const { isPending, error, mutate: mutateOnboard } = useMutation(onboardUser);
   const roleBasedRedirect = useRoleBasedRedirect();

   const methods = useForm<OnboardingSchemaTypes>({
      resolver: zodResolver(onboardingSchema),
      defaultValues
   });

   // Submit onboarding form
   const onFormSubmit = async (data: OnboardingSchemaTypes) => {
      const result = await mutateOnboard(data);

      if (result) {
         toast.success('Your profile has been set up successfully!');
         void roleBasedRedirect();
      }
   };

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   return (
      <GradientWrapper className="flex items-center justify-center px-4 py-10">

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
                        onValueChange={(val) => methods.setValue('role', val as AssignedRole)}
                        className="w-full space-y-4"
                     >
                        <TabsList className="w-full grid grid-cols-2 h-12! bg-[#121520]/80 p-1 rounded-xl border border-zinc-800/80">
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
                                    spinnerClass='text-zinc-700'
                                    textClass='text-zinc-700'
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
      </GradientWrapper>
   );
};

export default Onboarding;