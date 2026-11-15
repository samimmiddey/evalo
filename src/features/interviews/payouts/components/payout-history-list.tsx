"use client";

import PrimaryBody from "@/components/common/primary-body";
import { useInfiniteFetch } from "@/hooks/use-infinite-fetch";
import { getPayoutRecords } from "../services/payout.client.service";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, features } from "@/components/common/data-table/data-table";
import { PayoutRecord } from "../types/payout.types";
import SecondaryTitle from "@/components/common/secondary-title";
import { CircleCheckBig, Copy, IndianRupee } from "lucide-react";
import getStatusBadge from "@/components/common/get-status-badge";
import { formatDate } from "@/utils/format-date";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { RefetchFunctions } from "../payouts";
import { copyText } from "@/utils/copy-text";
import { toast } from "sonner";

interface PayoutHistoryListProps {
   setRefetchFn: Dispatch<SetStateAction<RefetchFunctions>>;
}

export const PayoutHistoryList = ({ setRefetchFn }: PayoutHistoryListProps) => {
   const [copiedId, setCopiedId] = useState<string | null>(null);
   const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   const params = {
      page: 1,
      pageSize: 10
   };

   const { isLoading, data, error, hasNextPage, isFetchingNextPage, fetchNextPage, refetch: refetchPayoutRecords } = useInfiniteFetch(page => getPayoutRecords({ ...params, page }));

   const refetchRef = useRef(refetchPayoutRecords);

   useEffect(() => {
      refetchRef.current = refetchPayoutRecords;
   });

   useEffect(() => {
      setRefetchFn(prev => ({ ...prev, refetchPayout: () => refetchRef.current() }));
   }, [setRefetchFn]);

   // Handle copy cashgram Url
   const handleCopyText = async (value: string, id: string) => {
      const ok = await copyText(value);
      if (!ok) {
         toast.error('Failed to copy to clipboard');
         return;
      }

      if (copyTimeoutRef.current) {
         clearTimeout(copyTimeoutRef.current);
      }

      setCopiedId(id);
      copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 1500);
   };

   // Clear copy timeout on unmount
   useEffect(() => {
      return () => {
         if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
         }
      };
   }, []);

   // Columns
   const columns: ColumnDef<typeof features, PayoutRecord>[] = [
      {
         accessorKey: 'credits',
         header: 'Credits',
         size: 110,
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
         size: 140,
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
         size: 140,
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
         size: 160,
         cell: (info) => (
            getStatusBadge(info.getValue<string>())
         ),
      },
      {
         accessorKey: 'utr',
         header: 'UTR',
         size: 175,
         cell: ({ row }) => {
            const { utr, id } = row.original;

            return (
               <div className="flex items-center gap-2">
                  <PrimaryBody
                     text={utr ?? '-'}
                     className="text-xs! truncate"
                  />
                  {
                     utr &&
                     (
                        copiedId === id ?
                           <CircleCheckBig className='h-3.5 w-3.5 text-emerald-400 shrink-0' /> :
                           <Copy
                              className='h-3.5 w-3.5 text-zinc-400 cursor-pointer shrink-0'
                              onClick={() => void handleCopyText(utr, id)}
                           />
                     )
                  }
               </div>
            );
         },
      },
      {
         accessorKey: 'adminNote',
         header: 'Note',
         size: 175,
         cell: ({ row }) => {
            const { adminNote } = row.original;

            return (
               <div className="max-w-43.75 wrap-break-word whitespace-normal">
                  <PrimaryBody
                     text={adminNote ?? '-'}
                     className="text-xs!"
                  />
               </div>
            );
         },
      },
      {
         accessorKey: 'createdAt',
         header: 'Requested Date',
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
      },
      {
         accessorKey: 'updatedAt',
         header: 'Last Updated',
         size: 175,
         cell: ({ row }) => {
            const { updatedAt } = row.original;

            return (
               <PrimaryBody
                  text={formatDate(updatedAt)}
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
         skeletonRows={5}
         error={error}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
         fetchNextPage={fetchNextPage}
         pageSize={params.pageSize}
         contentType="payouts"
      />
   );
};

export default PayoutHistoryList;
