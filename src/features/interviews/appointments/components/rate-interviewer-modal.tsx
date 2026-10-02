"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation } from "@/hooks/use-mutation";
import { rateInterviewer } from "../services/appointments.client.service";
import {
   RateInterviewerSchemaTypes,
   rateInterviewerSchema
} from "../schemas/appointments.schemas";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";
import PrimaryBody from "@/components/common/primary-body";

interface RateInterviewerModalProps {
   open: boolean;
   onClose: () => void;
   bookingId: string;
   interviewerName: string;
   onSuccess: () => void;
}

const RATING_LABELS: Record<number, string> = {
   1: "Poor — Needs significant improvement",
   2: "Fair — Below expectations",
   3: "Good — Met expectations",
   4: "Very Good — Thorough & helpful",
   5: "Excellent — Outstanding session & guidance"
};

export const RateInterviewerModal = ({
   open,
   onClose,
   bookingId,
   interviewerName,
   onSuccess
}: RateInterviewerModalProps) => {
   const [hoveredRating, setHoveredRating] = useState<number | null>(null);

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors }
   } = useForm<RateInterviewerSchemaTypes>({
      resolver: zodResolver(rateInterviewerSchema),
      defaultValues: {
         bookingId,
         rating: 5,
         comment: ""
      }
   });

   const currentRating = watch("rating") || 0;
   const commentWatch = watch("comment") || "";

   const { isPending, mutate } = useMutation(rateInterviewer);

   const onSubmit = async (data: RateInterviewerSchemaTypes) => {
      const res = await mutate(data);

      if (res?.success) {
         toast.success("Thank you! Your rating has been submitted.");
         reset();
         onSuccess();
         onClose();
      }
   };

   const activeRating = hoveredRating ?? currentRating;

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title="Interview Feedback & Rating"
         description={`Rate your overall mock interview experience and share feedback on your session with ${interviewerName}.`}
         headerIcon={<Star className="w-4 h-4 text-violet-400" />}
         className='max-w-3xl!'
      >
         <form
            onSubmit={(e) => {
               void handleSubmit((data) => void onSubmit(data))(e);
            }}
            className="space-y-6 text-zinc-100"
         >
            {/* Interactive Stars Section */}
            <div className="p-5 rounded-xl bg-zinc-900/60 border border-white/5 flex flex-col items-center justify-center text-center space-y-3">
               <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Overall Rating
               </Label>

               {/* 5 Stars */}
               <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                     const isFilled = star <= activeRating;

                     return (
                        <button
                           key={star}
                           type="button"
                           onClick={() => setValue("rating", star, { shouldValidate: true })}
                           onMouseEnter={() => setHoveredRating(star)}
                           onMouseLeave={() => setHoveredRating(null)}
                           className="p-1.5 transition-transform hover:scale-115 cursor-pointer rounded-lg hover:bg-white/5 focus:outline-none"
                           aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                           <Star
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${isFilled
                                 ? "text-amber-400 fill-amber-400"
                                 : "text-zinc-600 hover:text-zinc-400"
                                 }`}
                           />
                        </button>
                     );
                  })}
               </div>

               {/* Rating Descriptor */}
               <PrimaryBody
                  text={RATING_LABELS[activeRating] ?? "Select a star rating"}
                  className="text-xs! 2xl:text-xs! font-medium text-amber-300 min-h-4"
               />

               {errors.rating && (
                  <p className="text-xs text-rose-400">{errors.rating.message}</p>
               )}
            </div>

            {/* Optional Comment Field */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Label htmlFor="comment" className="text-xs 2xl:text-[13px] font-medium text-zinc-300">
                     Feedback
                  </Label>
                  <span className="text-[11px] text-zinc-500">
                     {commentWatch.length} / 500
                  </span>
               </div>
               <Textarea
                  id="comment"
                  placeholder="What went well? How helpful was the feedback and technical guidance?"
                  maxLength={500}
                  {...register("comment")}
                  className="bg-zinc-900 border-white/10 text-zinc-200 text-xs h-24 placeholder:text-zinc-500"
               />
               {errors.comment && (
                  <p className="text-xs text-rose-400">{errors.comment.message}</p>
               )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending}
                  className="text-xs rounded-lg h-9 px-4.5 cursor-pointer"
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={isPending || currentRating < 1}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-2 text-xs rounded-lg h-9 px-5 cursor-pointer"
               >
                  {isPending ? <Spinner className="size-4" /> : <Star className="w-4 h-4" />}
                  Submit Rating
               </Button>
            </div>
         </form>
      </ModalWrapper>
   );
};

export default RateInterviewerModal;
