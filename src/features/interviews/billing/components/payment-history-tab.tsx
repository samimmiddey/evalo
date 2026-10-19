"use client";

import { format, parseISO } from "date-fns";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";
import { billingData } from "@/data/billing/billing.data";
import ErrorCard from "@/components/common/error-card";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { getCandidatePayments } from "../services/billing.client.service";
import { DataTable, features } from "@/components/common/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CashfreePaymentRecord } from "../types/billing.types";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";

const formatPaymentDate = (dateStr?: string | null) => {
   if (!dateStr) return "-";
   try {
      // Normalizes "YYYY-MM-DD HH:mm:ss" to ISO if needed
      const normalized = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
      const parsed = parseISO(normalized);
      return isNaN(parsed.getTime()) ? dateStr : format(parsed, "PPp");
   } catch {
      return dateStr;
   }
};

const PaymentHistoryTab = () => {
   const { paymentsTab } = billingData;

   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFetch((page) => getCandidatePayments({ ...params, page }));

   // No data state
   if (data.length === 0 && !isLoading) {
      return (
         <EnhancedNoDataCard
            title={paymentsTab.emptyTitle}
            body={paymentsTab.emptyDescription}
         />
      );
   }

   // Error state
   if (error) {
      return (
         <ErrorCard text={error} />
      );
   }

   const getPaymentStatusBadge = (status: string) => {
      switch (status) {
         case "SUCCESS":
            return (
               <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {paymentsTab.statusBadges.success}
               </Badge>
            );
         case "FAILED":
            return (
               <Badge className="text-xs bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  {paymentsTab.statusBadges.failed}
               </Badge>
            );
         default:
            return (
               <Badge className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  {status}
               </Badge>
            );
      }
   };

   const columns: ColumnDef<typeof features, CashfreePaymentRecord>[] = [
      {
         accessorKey: 'paymentCurrency',
         header: 'Currency',
         size: 200,
         cell: ({ row }) => {
            const curr = row.original;

            return (
               <SecondaryTitle
                  text={curr.paymentCurrency}
                  className="text-xs! 2xl:text-sm! truncate font-medium"
               />
            );
         },
      },
      {
         accessorKey: 'paymentMethod',
         header: 'Payment Method',
         size: 200,
         cell: (info) => (
            <PrimaryBody
               className="text-[11px]! 2xl:text-xs!"
               text={info.getValue<string | null>() ?? '-'}
            />
         ),
      },
      {
         accessorKey: 'paymentAmount',
         header: 'Amount',
         size: 175,
         cell: ({ row }) => {
            const { paymentAmount } = row.original;

            return (
               <div className="flex items-center gap-0.5">
                  <IndianRupee className="h-3 w-3" />
                  <SecondaryTitle
                     className='text-xs! 2xl:text-sm!'
                     text={paymentAmount.toFixed(2)}
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'paymentStatus',
         header: 'Payment Status',
         size: 200,
         cell: (info) => (
            getPaymentStatusBadge(info.getValue<string>())
         ),
      },
      {
         accessorKey: 'paymentTime',
         header: 'Date',
         size: 175,
         cell: ({ row }) => {
            const tx = row.original;

            return (
               <PrimaryBody
                  text={formatPaymentDate(tx.paymentTime)}
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
      />
   );
};

export default PaymentHistoryTab;
