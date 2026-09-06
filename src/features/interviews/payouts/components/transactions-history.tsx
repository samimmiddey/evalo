import { CreditTransactionRecord } from "../types/payout.types";
import { format, parseISO } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";

interface TransactionsHistoryProps {
   transactions: CreditTransactionRecord[];
}

export const TransactionsHistory = ({ transactions }: TransactionsHistoryProps) => {
   if (transactions.length === 0) {
      return (
         <div className="p-8 text-center bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl">
            <PrimaryBody text="No transaction records found." className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-500!" />
         </div>
      );
   }

   const getTransactionLabel = (type: CreditTransactionRecord["type"]) => {
      switch (type) {
         case "BOOKING_EARNING":
            return "Session Earning";
         case "ADMIN_ADJUSTMENT":
            return "Payout Withdrawal";
         case "BOOKING_REFUND":
            return "Session Refund";
         case "BOOKING_REVERSAL":
            return "Session Reversal";
         default:
            return type;
      }
   };

   return (
      <div className="space-y-2.5">
         {transactions.map((tx) => {
            const isPositive = tx.amount > 0;

            return (
               <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-white/5"
               >
                  <div className="flex items-center gap-3">
                     <div
                        className={cn(
                           "flex items-center justify-center w-8 h-8 rounded-lg border",
                           isPositive
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                        )}
                     >
                        {isPositive ? (
                           <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                           <ArrowUpRight className="w-4 h-4" />
                        )}
                     </div>
                     <div>
                        <SecondaryTitle
                           text={getTransactionLabel(tx.type)}
                           className="text-xs! font-semibold! text-zinc-200!"
                        />
                        <PrimaryBody
                           text={format(parseISO(tx.createdAt), "PPp")}
                           className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-500!"
                        />
                     </div>
                  </div>

                  <span
                     className={cn(
                        "text-sm font-bold",
                        isPositive ? "text-emerald-400" : "text-rose-400"
                     )}
                  >
                     {isPositive ? `+${tx.amount}` : tx.amount} Credits
                  </span>
               </div>
            );
         })}
      </div>
   );
};

export default TransactionsHistory;
