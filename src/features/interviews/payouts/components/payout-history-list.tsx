"use client";

import PrimaryBody from "@/components/common/primary-body";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { getPayoutRecords } from "../services/payout.client.service";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import ErrorCard from "@/components/common/error-card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, features } from "@/components/common/data-table/data-table";
import { PayoutRecord } from "../types/payout.types";
import SecondaryTitle from "@/components/common/secondary-title";
import { IndianRupee } from "lucide-react";
import getStatusBadge from "@/components/common/get-status-badge";
import { formatDate } from "@/utils/format-date";

export const PayoutHistoryList = () => {
   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteFetch(page => getPayoutRecords({ ...params, page }));

   // No data state
   if (data.length === 0 && !isLoading) {
      return (
         <EnhancedNoDataCard
            title='No payouts yet'
            body='There are no payouts yet'
         />
      );
   }

   // Error state
   if (error) {
      return (
         <ErrorCard text={error} />
      );
   }

   // Columns
   const columns: ColumnDef<typeof features, PayoutRecord>[] = [
      {
         accessorKey: 'credits',
         header: 'Credits',
         size: 150,
         cell: ({ row }) => {
            const { credits } = row.original;

            return (
               <SecondaryTitle
                  text={credits.toString()}
                  className="text-xs! 2xl:text-sm!"
               />
            );
         },
      },
      {
         accessorKey: 'netAmount',
         header: 'Amount',
         size: 150,
         cell: ({ row }) => {
            const { netAmount } = row.original;

            return (
               <div className="flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  <SecondaryTitle
                     className='text-xs! 2xl:text-sm!'
                     text={netAmount.toFixed(2).toString()}
                  />
               </div>
            );
         },
      },
      {
         accessorKey: 'platformFee',
         header: 'Platform Fee',
         size: 150,
         cell: ({ row }) => {
            const { platformFee } = row.original;

            return (
               <div className="flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  <SecondaryTitle
                     className='text-xs! 2xl:text-sm!'
                     text={platformFee.toFixed(2).toString()}
                  />
               </div>
            );
         }
      },
      {
         accessorKey: 'status',
         header: 'Request Status',
         size: 175,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         ),
      },
      {
         accessorKey: 'adminNote',
         header: 'Note',
         size: 200,
         cell: ({ row }) => {
            const { adminNote } = row.original;

            return (
               <PrimaryBody
                  text={adminNote ?? '-'}
                  className="text-xs!"
               />
            );
         },
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

export default PayoutHistoryList;
