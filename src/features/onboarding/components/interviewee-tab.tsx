'use client';

import { motion } from 'motion/react';
import SelectedRoleBadge from './selected-role-badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { onboardingData } from '@/data/onboarding/onboarding.data';
import NoDataCard from '@/components/common/no-data-card';
import InputError from '@/components/common/input-error';
import { OnboardingSchemaTypes } from '../schemas/onboarding.schemas';
import { AssignedRole } from '@/types/user.types';

const IntervieweeTab = () => {
   const methods = useFormContext<OnboardingSchemaTypes>();
   const data = onboardingData.intervieweeTab;

   if (!data) {
      return <NoDataCard text="No Data Available" />;
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
      >
         {/* Selected role */}
         <SelectedRoleBadge
            role={data.selectedRoleBadge.title}
            onChangeRole={() => methods.setValue('role', data.selectedRoleBadge.value as AssignedRole)}
         />

         {/* Context card */}
         <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 2xl:p-5 space-y-3.5 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                  <data.contextCard.icon className="w-4 h-4" />
               </div>
               <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{data.contextCard.title}</h4>
                  <p className="text-xs text-zinc-400">{data.contextCard.description}</p>
               </div>
            </div>

            <ul className="space-y-2 pt-2 border-t border-zinc-800/80">
               {
                  data.contextCard.list.map((item) => (
                     <li key={item.title} className="flex items-center gap-2 text-xs text-zinc-300">
                        <item.icon className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{item.title}</span>
                     </li>
                  ))
               }
            </ul>
         </div>

         {/* Form fields */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-4.5">
            {
               data.formFields.map((field) => {
                  return (
                     <div key={field.name} className="flex flex-col gap-2">
                        <Label htmlFor={field.name} className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                           <field.icon className="w-3.5 h-3.5 text-violet-400" />
                           {field.label}
                        </Label>
                        <Input
                           {...methods.register(field.name as keyof OnboardingSchemaTypes)}
                           type={field.type}
                           placeholder={field.placeholder}
                           className="text-sm!"
                        />
                        {
                           methods.formState.errors[field.name as keyof OnboardingSchemaTypes] && (
                              <InputError message={methods.formState.errors[field.name as keyof OnboardingSchemaTypes]?.message} />
                           )
                        }
                     </div>
                  );
               })
            }
         </div>
      </motion.div>
   );
};

export default IntervieweeTab;



