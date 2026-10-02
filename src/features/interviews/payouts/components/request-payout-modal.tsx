"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@/hooks/use-mutation";
import { requestPayout } from "../services/payout.client.service";
import {
   RequestPayoutSchemaTypes,
   requestPayoutSchema
} from "../schemas/payout.schemas";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { DollarSign, Wallet } from "lucide-react";
import { useAppUser } from "@/hooks/use-app-user";

interface RequestPayoutModalProps {
   open: boolean;
   onClose: () => void;
   maxCredits: number;
   ratePerCredit: number;
   platformFeePercent: number;
   onSuccess: () => void;
}

export const RequestPayoutModal = ({
   open,
   onClose,
   maxCredits,
   ratePerCredit,
   platformFeePercent,
   onSuccess
}: RequestPayoutModalProps) => {
   const { refetch: refetchUser } = useAppUser();

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors }
   } = useForm<RequestPayoutSchemaTypes>({
      resolver: zodResolver(requestPayoutSchema),
      defaultValues: {
         credits: maxCredits
      }
   });

   const creditsWatch = watch("credits") || 0;

   const grossAmount = creditsWatch * ratePerCredit;
   const platformFee = grossAmount * (platformFeePercent / 100);
   const netAmount = Math.max(0, grossAmount - platformFee);

   const { isPending, mutate } = useMutation(requestPayout);

   const onSubmit = async (data: RequestPayoutSchemaTypes) => {
      if (data.credits > maxCredits) {
         toast.error(`You can only withdraw up to ${maxCredits} credits.`);
         return;
      }

      const res = await mutate(data);

      if (res?.success) {
         toast.success("Payout request submitted successfully. Processing will begin shortly.");
         reset();
         onSuccess();
         onClose();
         await refetchUser();
      }
   };

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title="Request Credit Payout"
         description="Convert your earned interview credits to cash. Payouts are processed within 2-3 business days."
         className="max-w-3xl!"
      >
         <form
            onSubmit={(e) => {
               void handleSubmit((data) => void onSubmit(data))(e);
            }}
            className="space-y-5 2xl:space-y-6 text-zinc-100"
         >
            {/* Calculation Card */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/15 space-y-3">
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Available Balance:</span>
                  <span className="font-semibold text-zinc-300">{maxCredits} Credits</span>
               </div>
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Conversion Rate:</span>
                  <span>${ratePerCredit} / credit</span>
               </div>
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Platform Fee ({platformFeePercent}%):</span>
                  <span className="text-rose-400">-${platformFee.toFixed(2)}</span>
               </div>
               <div className="pt-2 border-t border-zinc-500/15 flex items-center justify-between text-sm font-semibold text-zinc-100">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                     <DollarSign className="w-4 h-4" /> Net Payout Amount:
                  </span>
                  <span className="text-emerald-400 text-base">${netAmount.toFixed(2)}</span>
               </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
               {/* Credits to Withdraw */}
               <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                     <Label htmlFor="credits" className="text-xs 2xl:text-[13px] font-medium text-zinc-300">
                        Credits to Withdraw
                     </Label>
                     <button
                        type="button"
                        onClick={() => setValue("credits", maxCredits, { shouldValidate: true })}
                        className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                     >
                        Max ({maxCredits})
                     </button>
                  </div>
                  <Input
                     id="credits"
                     type="number"
                     min={1}
                     max={maxCredits}
                     {...register("credits", { valueAsNumber: true })}
                     className="bg-zinc-900 border-white/10 text-zinc-100"
                  />
                  {errors.credits && (
                     <p className="text-xs 2xl:text-[13px] text-rose-400">{errors.credits.message}</p>
                  )}
               </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending}
                  className="text-xs rounded-lg h-9 px-4.5"
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={isPending || maxCredits < 1}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-2 text-xs rounded-lg h-9 px-4.5"
               >
                  {isPending ? <Spinner className="size-4" /> : <Wallet className="w-4 h-4" />}
                  Submit Request
               </Button>
            </div>
         </form>
      </ModalWrapper>
   );
};

export default RequestPayoutModal;
