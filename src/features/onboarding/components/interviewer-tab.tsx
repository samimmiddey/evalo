'use client';

import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SelectedRoleBadge from './selected-role-badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { DOMAINS, onboardingData, YEARS_OF_EXPERIENCE } from '@/data/onboarding/onboarding.data';
import NoDataCard from '@/components/common/no-data-card';
import InputError from '@/components/common/input-error';
import { OnboardingSchemaTypes } from '../schemas/onboarding.schemas';
import { DomainValue } from '@/data/onboarding/onboardiong.types';
import { MultiSelect } from '@/components/common/multi-select';
import { AssignedRole } from '@/models/user.model';

const InterviewerTab = () => {
   const methods = useFormContext<OnboardingSchemaTypes>();
   const data = onboardingData.interviewerTab;

   if (!true) {
      return <NoDataCard text="No Data Available" />;
   }

   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
      >
         {/* Selected role badge */}
         <SelectedRoleBadge
            role={data.selectedRoleBadge.title}
            onChangeRole={() => methods.setValue('role', data.selectedRoleBadge.value as AssignedRole)}
         />

         {/* Form fields */}
         <div className="space-y-4">

            {/* Designation + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-4.5">

               {
                  data.formFields.map((field) => (
                     <div
                        key={field.name}
                        className={`flex flex-col gap-2 ${field.type === "textarea"
                           ? "sm:col-span-2"
                           : ""
                           }`}
                     >
                        <Label htmlFor={field.name} className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                           <field.icon className="w-3.5 h-3.5 text-violet-400" />
                           {field.label}
                        </Label>

                        {/* Text Input */}
                        {
                           (field.type === 'text' || field.type === 'number') && (
                              <Input
                                 {...methods.register(field.name as keyof OnboardingSchemaTypes)}
                                 type={field.type}
                                 placeholder={field.placeholder}
                                 className="text-sm!"
                              />
                           )
                        }

                        {/* Select Menu */}
                        {
                           field.type === 'select' && (
                              <Select
                                 value={methods.watch(field.name as keyof OnboardingSchemaTypes) as string}
                                 onValueChange={val => methods.setValue(field.name as keyof OnboardingSchemaTypes, val, { shouldValidate: true })}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder={YEARS_OF_EXPERIENCE[0].label} />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectGroup>
                                       <SelectLabel>{field.label}</SelectLabel>
                                       {YEARS_OF_EXPERIENCE.map((item) => (
                                          <SelectItem key={item.value} value={item.value}>
                                             {item.label}
                                          </SelectItem>
                                       ))}
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           )
                        }

                        {/* Chips Selection */}
                        {
                           field.type === 'chips' && (
                              <MultiSelect
                                 options={DOMAINS}
                                 onValueChange={(val) => methods.setValue(field.name as keyof OnboardingSchemaTypes, val as DomainValue[], { shouldValidate: true })}
                                 placeholder="Choose expertise..."
                                 variant="inverted"
                                 className="rounded-lg border border-input bg-transparent dark:bg-input/30 px-2.5 h-10 2xl:h-11 text-sm 2xl:text-base focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50 transition-all hover:bg-input/30 hover:translate-y-0"
                                 maxCount={1}
                              />
                           )
                        }

                        {/* Textarea */}
                        {
                           field.type === 'textarea' && (
                              <Textarea
                                 {...methods.register(field.name as keyof OnboardingSchemaTypes)}
                                 placeholder={field.placeholder}
                                 className="min-h-22 text-sm! resize-none"
                              />
                           )
                        }

                        {
                           methods.formState.errors[field.name as keyof OnboardingSchemaTypes] && (
                              <InputError message={methods.formState.errors[field.name as keyof OnboardingSchemaTypes]?.message} />
                           )
                        }
                     </div>
                  ))
               }
            </div>
         </div>
      </motion.div>
   );
};

export default InterviewerTab;



