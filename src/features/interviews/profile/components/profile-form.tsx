"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   UpdateInterviewerProfileSchemaTypes,
   updateInterviewerProfileSchema
} from "../schema/profile.schema";
import { updateInterviewerProfile } from "../services/profile.client.service";
import { useMutation } from "@/hooks/use-mutation";
import { useDbUser } from "@/hooks/use-db-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/common/multi-select";
import { DOMAINS } from "@/data/onboarding/onboarding.data";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Building2, Flame, Save, Settings, User, UserPen } from "lucide-react";
import { ProfileSkeleton } from "./skeletons/profile-skeleton";
import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";

interface ProfileFormProps {
   onProfileUpdated?: () => void;
}

export const ProfileForm = ({ onProfileUpdated }: ProfileFormProps) => {
   const { user, isLoading: isUserLoading, refetch } = useDbUser();

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors, isDirty }
   } = useForm<UpdateInterviewerProfileSchemaTypes>({
      resolver: zodResolver(updateInterviewerProfileSchema),
      defaultValues: {
         designation: "",
         company: "",
         experience: 3,
         expertise: [],
         bio: ""
      }
   });

   // Populate form with current user details
   useEffect(() => {
      if (user) {
         reset({
            designation: user.designation ?? "",
            company: user.company ?? "",
            experience: user.experience ?? 1,
            expertise: (user.expertise as UpdateInterviewerProfileSchemaTypes["expertise"]) ?? [],
            bio: user.bio ?? ""
         });
      }
   }, [user, reset]);

   const { isPending, mutate } = useMutation(updateInterviewerProfile);

   const onSubmit = async (data: UpdateInterviewerProfileSchemaTypes) => {
      const res = await mutate(data);
      if (res) {
         toast.success("Profile updated successfully");
         void refetch();
         if (onProfileUpdated) onProfileUpdated();
      }
   };

   if (isUserLoading) {
      return <ProfileSkeleton />;
   }

   const expertiseWatch = watch("expertise") || [];

   return (
      <div className="space-y-6">
         {/* Form Card */}
         <CardLayout className="bg-zinc-900/40! border-white/5! hover:shadow-none">
            <div className="flex items-start gap-2.5 pb-5 border-b border-white/5 mb-6">
               <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 shrink-0 mt-0.5">
                  <UserPen className="w-4 h-4" />
               </div>
               <div>
                  <SecondaryTitle
                     text="Interviewer Profile & Session Rates"
                     className="text-base! font-semibold! text-zinc-100!"
                  />
                  <PrimaryBody
                     text="Customize how your profile appears to candidates and configure your booking rate."
                     className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                  />
               </div>
            </div>

            <form
               onSubmit={(e) => {
                  void handleSubmit((data) => void onSubmit(data))(e);
               }}
               className="space-y-6 text-zinc-100 font-inter"
            >
               {/* 2 Column Row: Designation & Company */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label
                        htmlFor="designation"
                        className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                     >
                        <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                        Designation / Role Title
                     </Label>
                     <Input
                        id="designation"
                        placeholder="e.g. Senior Frontend Engineer"
                        {...register("designation")}
                        className="bg-zinc-900 border-white/10 text-zinc-100 text-sm!"
                     />
                     {errors.designation && (
                        <p className="text-xs text-rose-400">{errors.designation.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label
                        htmlFor="company"
                        className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                     >
                        <Building2 className="w-3.5 h-3.5 text-violet-400" />
                        Current Company
                     </Label>
                     <Input
                        id="company"
                        placeholder="e.g. Google, Stripe, Microsoft"
                        {...register("company")}
                        className="bg-zinc-900 border-white/10 text-zinc-100 text-sm!"
                     />
                     {errors.company && (
                        <p className="text-xs text-rose-400">{errors.company.message}</p>
                     )}
                  </div>
               </div>

               {/* 2 Column Row: Experience & Expertise Domains */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label
                        htmlFor="experience"
                        className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                     >
                        <Flame className="w-3.5 h-3.5 text-violet-400" />
                        Years of Industry Experience
                     </Label>
                     <Input
                        id="experience"
                        type="number"
                        min={0}
                        max={50}
                        {...register("experience", { valueAsNumber: true })}
                        className="bg-zinc-900 border-white/10 text-zinc-100 text-sm!"
                     />
                     {errors.experience && (
                        <p className="text-xs text-rose-400">{errors.experience.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                        <Settings className="w-3.5 h-3.5 text-violet-400" />
                        Interview Domains & Technical Expertise
                     </Label>
                     <MultiSelect
                        options={DOMAINS}
                        defaultValue={expertiseWatch}
                        onValueChange={(val) =>
                           setValue(
                              "expertise",
                              val as UpdateInterviewerProfileSchemaTypes["expertise"],
                              { shouldValidate: true, shouldDirty: true }
                           )
                        }
                        placeholder="Select expertise domains..."
                        variant="inverted"
                        className="rounded-lg border border-white/15 bg-zinc-900 px-3 h-11 text-sm focus-visible:border-violet-500 hover:bg-zinc-900"
                        maxCount={2}
                     />
                     {errors.expertise && (
                        <p className="text-xs text-rose-400">{errors.expertise.message}</p>
                     )}
                  </div>
               </div>

               {/* Bio / About */}
               <div className="space-y-2">
                  <Label
                     htmlFor="bio"
                     className="text-xs font-medium text-zinc-300 flex items-center gap-1.5"
                  >
                     <User className="w-3.5 h-3.5 text-violet-400" />
                     About Me & Interview Style
                  </Label>
                  <Textarea
                     id="bio"
                     rows={4}
                     placeholder="Describe your background, what candidates can expect in your sessions, and your technical focus areas..."
                     {...register("bio")}
                     className="bg-zinc-900 border-white/10 text-zinc-100 text-sm resize-none h-25"
                  />
                  {errors.bio && <p className="text-xs text-rose-400">{errors.bio.message}</p>}
               </div>

               {/* Save Button */}
               <div className="flex items-center justify-end pt-4 border-t border-white/5">
                  <Button
                     type="submit"
                     disabled={isPending || !isDirty}
                     className="cursor-pointer bg-violet-600 hover:bg-violet-700 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5"
                  >
                     {isPending ? <Spinner className="size-4" /> : <Save className="w-4 h-4" />}
                     Save Changes
                  </Button>
               </div>
            </form>
         </CardLayout>
      </div>
   );
};

export default ProfileForm;
