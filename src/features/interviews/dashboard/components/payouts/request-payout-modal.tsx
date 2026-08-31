"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dashboardData } from "@/data/dashboard/dashboard.data";
import { useMutation } from "@/hooks/use-mutation";
import { requestPayout } from "../../services/dashboard.client.service";
import {
   RequestPayoutSchemaTypes,
   requestPayoutSchema
} from "../../schemas/dashboard.schemas";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { DollarSign, Wallet } from "lucide-react";

interface RequestPayoutModalProps {
   open: boolean;
   onClose: () => void;
   maxCredits: number;
   onSuccess: () => void;
}

export const RequestPayoutModal = ({
   open,
   onClose,
   maxCredits,
   onSuccess
}: RequestPayoutModalProps) => {
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
         credits: Math.min(maxCredits, 5),
         paymentMethod: "BANK_TRANSFER",
         paymentDetail: ""
      }
   });

   const creditsWatch = watch("credits") || 0;
   const paymentMethodWatch = watch("paymentMethod");

   const grossAmount = creditsWatch * dashboardData.payout.ratePerCredit;
   const platformFee = grossAmount * (dashboardData.payout.platformFeePercent / 100);
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
      }
   };

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title="Request Credit Payout"
         description="Convert your earned interview credits to cash. Payouts are processed within 2-3 business days."
      >
         <form
            onSubmit={(e) => {
               void handleSubmit((data) => void onSubmit(data))(e);
            }}
            className="py-5 space-y-6 text-zinc-100 font-inter"
         >
            {/* Calculation Card */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-3">
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Available Balance:</span>
                  <span className="font-bold text-violet-300">{maxCredits} Credits</span>
               </div>
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Conversion Rate:</span>
                  <span>${dashboardData.payout.ratePerCredit} / credit</span>
               </div>
               <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Platform Fee ({dashboardData.payout.platformFeePercent}%):</span>
                  <span className="text-rose-400">-${platformFee.toFixed(2)}</span>
               </div>
               <div className="pt-2 border-t border-violet-500/20 flex items-center justify-between text-sm font-bold text-zinc-100">
                  <span className="flex items-center gap-1.5 text-violet-300">
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
                     <Label htmlFor="credits" className="text-xs font-medium text-zinc-300">
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
                     <p className="text-xs text-rose-400">{errors.credits.message}</p>
                  )}
               </div>

               {/* Payment Method */}
               <div className="space-y-1.5">
                  <Label htmlFor="paymentMethod" className="text-xs font-medium text-zinc-300">
                     Payment Method
                  </Label>
                  <Select
                     value={paymentMethodWatch}
                     onValueChange={(val) => setValue("paymentMethod", val, { shouldValidate: true })}
                  >
                     <SelectTrigger className="w-full bg-zinc-900 border-white/10 text-zinc-200">
                        <SelectValue placeholder="Select payment method" />
                     </SelectTrigger>
                     <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200">
                        {dashboardData.payout.paymentMethods.map((m) => (
                           <SelectItem key={m.value} value={m.value}>
                              {m.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                     <p className="text-xs text-rose-400">{errors.paymentMethod.message}</p>
                  )}
               </div>

               {/* Payment Details */}
               <div className="space-y-1.5">
                  <Label htmlFor="paymentDetail" className="text-xs font-medium text-zinc-300">
                     Payment Account / Transfer Details
                  </Label>
                  <Textarea
                     id="paymentDetail"
                     rows={3}
                     placeholder={
                        paymentMethodWatch === "BANK_TRANSFER"
                           ? "Bank Name, Account Number, Routing/IFSC Code, Account Holder Name"
                           : paymentMethodWatch === "PAYPAL"
                           ? "PayPal Email Address"
                           : "UPI ID / VPA (e.g., name@okaxis)"
                     }
                     {...register("paymentDetail")}
                     className="bg-zinc-900 border-white/10 text-zinc-200 text-xs"
                  />
                  {errors.paymentDetail && (
                     <p className="text-xs text-rose-400">{errors.paymentDetail.message}</p>
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
                  className="cursor-pointer"
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={isPending || maxCredits < 1}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-2 shadow-lg shadow-violet-600/20 cursor-pointer"
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
