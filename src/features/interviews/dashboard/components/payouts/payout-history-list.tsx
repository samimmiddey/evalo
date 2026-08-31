import { Badge } from "@/components/ui/badge";
import { PayoutRecord } from "../../types/dashboard.types";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock } from "lucide-react";
import PrimaryBody from "@/components/common/primary-body";

interface PayoutHistoryListProps {
   payouts: PayoutRecord[];
}

export const PayoutHistoryList = ({ payouts }: PayoutHistoryListProps) => {
   if (payouts.length === 0) {
      return (
         <div className="p-8 text-center bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl">
            <PrimaryBody text="No payout requests submitted yet." className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-500!" />
         </div>
      );
   }

   return (
      <div className="space-y-3">
         {payouts.map((item) => {
            const isProcessed = item.status === "PROCESSED";

            return (
               <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5"
               >
                  <div className="space-y-1">
                     <div className="flex items-center gap-2.5">
                        <span className="font-bold text-sm text-zinc-100">
                           ${item.netAmount.toFixed(2)}
                        </span>
                        <span className="text-xs text-zinc-400">({item.credits} credits)</span>
                        {isProcessed ? (
                           <Badge
                              variant="outline"
                              className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[11px] gap-1"
                           >
                              <CheckCircle2 className="w-3 h-3" /> Processed
                           </Badge>
                        ) : (
                           <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[11px] gap-1"
                           >
                              <Clock className="w-3 h-3" /> Processing
                           </Badge>
                        )}
                     </div>
                     <PrimaryBody
                        text={`Via ${item.paymentMethod.replace("_", " ")} • ${item.paymentDetail}`}
                        className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                     />
                  </div>

                  <div className="text-left sm:text-right text-[11px] text-zinc-500">
                     <PrimaryBody
                        text={`Requested: ${format(parseISO(item.createdAt), "PPp")}`}
                        className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500!"
                     />
                     {item.processedAt && (
                        <PrimaryBody
                           text={`Processed: ${format(parseISO(item.processedAt), "PPp")}`}
                           className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-emerald-400/80!"
                        />
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default PayoutHistoryList;
