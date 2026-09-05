"use client";

import { useMemo, useState, useEffect } from "react";
import { useFetch } from "@/hooks/use-fetch";
import { useMutation } from "@/hooks/use-mutation";
import {
   deleteAvailabilitySlot,
   getAvailabilitySlots
} from "../services/availability.client.service";
import { AvailabilitySlot } from "../types/availability.types";
import SlotItem from "./slot-item";
import AddSlotModal from "./add-slot-modal";
import { AvailabilitySkeleton } from "./skeletons/availability-skeleton";
import EnhancedNoDataCard from "@/components/common/enhanced-no-data-card";
import { Button } from "@/components/ui/button";
import { format, isToday, isTomorrow, parse } from "date-fns";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import CardLayout from "@/components/layouts/card-layout";
import SecondaryTitle from "@/components/common/secondary-title";
import PrimaryBody from "@/components/common/primary-body";

export const AvailabilityView = () => {
   const [openAddModal, setOpenAddModal] = useState<boolean>(false);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const {
      isLoading,
      data: slots,
      error,
      refetch
   } = useFetch<AvailabilitySlot[]>(() => getAvailabilitySlots());

   const { mutate: deleteSlotMutate } = useMutation((slotId: string) =>
      deleteAvailabilitySlot(slotId)
   );

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   // Group slots by date string YYYY-MM-DD
   const groupedSlots = useMemo(() => {
      if (!slots || slots.length === 0) return [];

      const groups: Record<string, AvailabilitySlot[]> = {};

      slots.forEach((slot) => {
         const dateKey = format(new Date(slot.startTime), "yyyy-MM-dd");
         if (!groups[dateKey]) {
            groups[dateKey] = [];
         }
         groups[dateKey].push(slot);
      });

      return Object.entries(groups).map(([dateStr, daySlots]) => {
         const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());

         let dayName = format(parsedDate, "EEEE");
         if (isToday(parsedDate)) dayName = "Today";
         else if (isTomorrow(parsedDate)) dayName = "Tomorrow";

         return {
            date: dateStr,
            dayName,
            displayDate: format(parsedDate, "MMMM d, yyyy"),
            slots: daySlots.sort(
               (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            )
         };
      });
   }, [slots]);

   const handleDeleteSlot = async (slotId: string) => {
      setDeletingId(slotId);
      const res = await deleteSlotMutate(slotId);
      setDeletingId(null);
      if (res) {
         toast.success("Availability slot removed");
         void refetch();
      }
   };

   return (
      <div className="space-y-6">
         {/* Top Action Bar */}
         <div className="flex items-center justify-between gap-4 p-2 sm:px-4 bg-zinc-900/40 border border-white/5 rounded-xl mb-7 2xl:mb-8 relative z-10 backdrop-blur-xl">
            <div>
               <SecondaryTitle
                  text="Configured Slots"
                  className="text-base! font-semibold! text-zinc-100!"
               />
               <PrimaryBody
                  text={slots ? `${slots.length} upcoming slots configured` : "Loading..."}
                  className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
               />
            </div>
            <Button
               onClick={() => setOpenAddModal(true)}
               className="cursor-pointer bg-violet-600/90 hover:bg-violet-600 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5"
            >
               <Plus className="w-4 h-4" />
               Add Slots
            </Button>
         </div>

         {/* Content */}
         {isLoading ? (
            <AvailabilitySkeleton />
         ) : groupedSlots.length > 0 ? (
            <div className="space-y-6">
               {groupedSlots.map((group) => (
                  <CardLayout
                     key={group.date}
                     className="p-5! space-y-4 bg-zinc-900/40! border-white/5! hover:shadow-none"
                  >
                     {/* Date Group Header */}
                     <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                           <Calendar className="w-4 h-4 text-violet-400" />
                           <span className="font-semibold text-sm text-zinc-200">
                              {group.dayName}
                           </span>
                           <span className="text-xs text-zinc-500">• {group.displayDate}</span>
                        </div>
                        <span className="text-xs font-medium text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full">
                           {group.slots.length} {group.slots.length === 1 ? "slot" : "slots"}
                        </span>
                     </div>

                     {/* Slots Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
                        {group.slots.map((slot) => (
                           <SlotItem
                              key={slot.id}
                              slot={slot}
                              onDelete={(slotId) => void handleDeleteSlot(slotId)}
                              isDeleting={deletingId === slot.id}
                           />
                        ))}
                     </div>
                  </CardLayout>
               ))}
            </div>
         ) : (
            <EnhancedNoDataCard
               title="No Availability Configured"
               body="You haven't set any availability slots yet. Add your available hours so candidates can schedule mock technical interviews."
            />
         )}

         {/* Add Slot Modal */}
         <AddSlotModal
            open={openAddModal}
            existingSlots={slots ?? []}
            onClose={() => setOpenAddModal(false)}
            onSuccess={() => void refetch()}
         />
      </div>
   );
};

export default AvailabilityView;
