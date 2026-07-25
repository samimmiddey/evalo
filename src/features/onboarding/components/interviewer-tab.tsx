'use client';

import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import SelectedRoleBadge from './selected-role-badge';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { DOMAINS, onboardingData, YEARS_OF_EXPERIENCE } from '@/data/onboarding/onboarding.data';
import NoDataCard from '@/components/common/no-data-card';
import InputError from '@/components/common/input-error';
import { OnboardingSchemaTypes } from '../schemas/onboarding.schemas';

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
            onChangeRole={() => methods.setValue('role', data.selectedRoleBadge.value as 'interviewee' | 'interviewer')}
         />

         {/* Form fields */}
         <div className="space-y-4">

            {/* Designation + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-4.5">

               {
                  data.formFields.map((field) => (
                     <div
                        key={field.name}
                        className={`flex flex-col gap-2 ${field.type === "chips" || field.type === "textarea"
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
                                 value={methods.watch(field.name as keyof OnboardingSchemaTypes)}
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
                              <ToggleGroup
                                 type="single"
                                 value={methods.watch(field.name as keyof OnboardingSchemaTypes)}
                                 onValueChange={(val) => val && methods.setValue(field.name as keyof OnboardingSchemaTypes, val, { shouldValidate: true })}
                                 className="flex flex-wrap gap-1.5 w-full justify-start"
                              >
                                 {DOMAINS.map((item) => (
                                    <ToggleGroupItem
                                       key={item}
                                       value={item}
                                       aria-label={item}
                                       className="text-xs h-7 px-3.5 rounded-full border border-white/10 bg-zinc-950/40 text-zinc-300 hover:bg-white/5 hover:text-white data-[state=on]:bg-violet-500/20 data-[state=on]:border-violet-500/50 data-[state=on]:text-violet-300 data-[state=on]:shadow-[0_0_12px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                                    >
                                       {item}
                                    </ToggleGroupItem>
                                 ))}
                              </ToggleGroup>
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
                              <InputError message={methods.formState.errors[field.name as keyof OnboardingSchemaTypes]?.message as string} />
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



