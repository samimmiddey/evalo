"use client";

import { CandidateCreditTransaction } from "../types/billing.types";
import { billingData } from "@/data/billing/billing.data";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { getCandidateTransactions } from "../services/billing.client.service";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, features } from "@/components/common/data-table/data-table";
import SecondaryTitle from "@/components/common/secondary-title";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import PrimaryBody from "@/components/common/primary-body";
import ErrorCard from "@/components/common/error-card";
import { formatDate } from "@/utils/format-date";

export const CreditTransactionsTab = () => {
   const { transactionsTab } = billingData;

   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFetch((page) => getCandidateTransactions({ ...params, page }));

   // No data state
   if (data.length === 0 && !isLoading) {
      return (
         <EnhancedNoDataCard
            title={transactionsTab.emptyTitle}
            body={transactionsTab.emptyDescription}
         />
      );
   }

   // Error state
   if (error) {
      return (
         <ErrorCard text={error} />
      );
   }

   const getTransactionLabel = (tx: CandidateCreditTransaction) => {
      switch (tx.type) {
         case "CREDIT_PURCHASE":
            return transactionsTab.typeLabels.creditPurchase;
         case "BOOKING_DEDUCTION":
            return tx.interviewerName
               ? `Mock Interview with ${tx.interviewerName}`
               : transactionsTab.typeLabels.bookingDeductionDefault;
         case "BOOKING_REFUND":
            return transactionsTab.typeLabels.bookingRefund;
         case "BOOKING_REVERSAL":
            return transactionsTab.typeLabels.bookingReversal;
         case "ADMIN_ADJUSTMENT":
            return transactionsTab.typeLabels.adminAdjustment;
         default:
            return tx.type;
      }
   };

   const columns: ColumnDef<typeof features, CandidateCreditTransaction>[] = [
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
                     text={getTransactionLabel(tx)}
                     className="text-xs! 2xl:text-sm! truncate font-medium"
                  />
               </div>
            );
         },
      },
      {
         accessorKey: 'reason',
         header: 'Reason',
         size: 175,
         cell: (info) => (
            <PrimaryBody
               className="text-xs!"
               text={info.getValue<string | null>() ?? '-'}
            />
         ),
      },
      {
         accessorKey: 'interviewerName',
         header: 'Interviewer',
         size: 200,
         cell: (info) => (
            <PrimaryBody
               className="text-xs! 2xl:text-sm!"
               text={info.getValue<string | null>() ?? '-'}
            />
         ),
      },
      {
         accessorKey: 'amount',
         header: 'Amount',
         size: 150,
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
            const tx = row.original;

            return (
               <PrimaryBody
                  text={formatDate(tx.createdAt)}
                  className="text-xs!"
               />
            );
         },
      }
   ];

   return (
      <DataTable
         columns={columns}
         data={data}
         isLoading={isLoading}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
         fetchNextPage={fetchNextPage}
         pageSize={params.pageSize}
         contentType="credit transactions"
      />
   );
};

export default CreditTransactionsTab;
