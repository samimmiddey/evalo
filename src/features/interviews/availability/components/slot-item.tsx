import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvailabilitySlot } from "../types/availability.types";
import { format } from "date-fns";
import { Clock, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { useState } from "react";

interface SlotItemProps {
   slot: AvailabilitySlot;
   onDelete: (id: string) => Promise<void> | void;
   isDeleting?: boolean;
}

interface ConfirmDialogueValue {
   id: string | null;
   value: boolean;
}

export const SlotItem = ({ slot, onDelete, isDeleting = false }: SlotItemProps) => {
   const [confirmDialogue, setConfirmDialogue] = useState<ConfirmDialogueValue>({
      id: null,
      value: false
   });

   const { id, startTime, endTime, status } = slot;

   const start = new Date(startTime);
   const end = new Date(endTime);

   const isBooked = status === "BOOKED";

   return (
      <>
         <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2.5">
               <Clock className="w-4 h-4 text-violet-400 shrink-0" />
               <span className="text-xs font-medium text-zinc-200">
                  {format(start, "p")} - {format(end, "p")}
               </span>
            </div>

            <div className="flex items-center gap-2">
               {isBooked ? (
                  <Badge
                     variant="outline"
                     className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs"
                  >
                     Booked
                  </Badge>
               ) : (
                  <Badge
                     variant="outline"
                     className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs"
                  >
                     Available
                  </Badge>
               )}

               {!isBooked && (
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     disabled={isDeleting}
                     onClick={() => setConfirmDialogue({ id: id, value: true })}
                     className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                     aria-label="Delete slot"
                  >
                     {isDeleting ? <Spinner className="size-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </Button>
               )}
            </div>
         </div>
         <ConfirmDialog
            open={confirmDialogue.value}
            onClose={() => setConfirmDialogue({ id: null, value: false })}
            onConfirm={async () => {
               if (confirmDialogue.id) {
                  await onDelete(confirmDialogue.id);
                  setConfirmDialogue({ id: null, value: false });
               }
            }}
            title="Delete Availability Slot"
            description="Are you sure you want to delete this time slot? Candidates will no longer be able to schedule mock interviews during this window."
            isLoading={isDeleting}
            confirmText="Confirm"
            variant="destructive"
         />
      </>
   );
};

export default SlotItem;
