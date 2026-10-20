"use client";

import { CreditTransactionRecord } from "../types/payout.types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { formatDate } from "@/utils/format-date";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { getCreditTransactions } from "../services/payout.client.service";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import ErrorCard from "@/components/common/error-card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, features } from "@/components/common/data-table/data-table";

export const TransactionsHistory = () => {
   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFetch(page => getCreditTransactions({ ...params, page }));

   // No data state
   if (data.length === 0 && !isLoading) {
      return (
         <EnhancedNoDataCard
            title='No transaction history found'
            body='No transaction history is found'
         />
      );
   }

   // Error
   if (error) {
      return (
         <ErrorCard text={error} />
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

   const columns: ColumnDef<typeof features, CreditTransactionRecord>[] = [
      {
         accessorKey: 'type',
         header: 'Type',
         size: 275,
         cell: ({ row }) => {
            const tx = row.original;
            const isPositive = tx.amount > 0;

            return (
               <div className="flex items-center gap-3 min-w-0">
                  <div className={`${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                     {
                        isPositive ? (
                           <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                           <ArrowUpRight className="w-4 h-4" />
                        )
                     }
                  </div>
                  <SecondaryTitle
                     text={getTransactionLabel(tx.type)}
                     className="text-xs! 2xl:text-sm! truncate font-medium"
                  />
               </div>
            );
         },
      },
      {
         accessorKey: 'amount',
         header: 'Amount',
         size: 175,
         cell: ({ row }) => {
            const { amount } = row.original;
            const isPositive = amount > 0;

            return (
               <SecondaryTitle
                  className={`text-xs! 2xl:text-sm! ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
                  text={`${isPositive ? `+${amount}` : amount} Credits`}
               />
            );
         }
      },
      {
         accessorKey: 'createdAt',
         header: 'Date',
         size: 175,
         cell: ({ row }) => {
            const { createdAt } = row.original;

            return (
               <PrimaryBody
                  text={formatDate(createdAt)}
                  className="text-xs!"
               />
            );
         }
      },
   ];

   return (
      <DataTable
         columns={columns}
         data={data}
         isLoading={isLoading}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
         fetchNextPage={fetchNextPage}
      />
   );
};

export default TransactionsHistory;
