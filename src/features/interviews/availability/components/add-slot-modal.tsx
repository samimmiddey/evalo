"use client";

import { useMemo, useState, useEffect } from "react";
import ModalWrapper from "@/components/wrappers/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { interviewerDashboardData } from "@/data/dashboard/dashboard.data";
import { addDays, addMinutes, format, parse } from "date-fns";
import { Plus, ClockFading } from "lucide-react";
import { useMutation } from "@/hooks/use-mutation";
import { createAvailabilitySlots } from "../services/availability.client.service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { AvailabilitySlot } from "../types/availability.types";
import CustomTooltip from "@/components/common/custom-tooltip";

interface AddSlotModalProps {
   open: boolean;
   existingSlots?: AvailabilitySlot[];
   onClose: () => void;
   onSuccess: () => void;
}

interface GeneratedSlotItem {
   startTime: string;
   endTime: string;
   displayStart: string;
   displayEnd: string;
   selected: boolean;
   isOverlapping: boolean;
}

// Helper to check if a preset time window has already passed for a given date
const isPresetExpired = (preset: { start: string; end: string; }, dateStr: string, todayStr: string) => {
   if (dateStr > todayStr) return false;
   if (dateStr < todayStr) return true;

   try {
      const baseDate = parse(dateStr, "yyyy-MM-dd", new Date());
      const [endHour, endMin] = preset.end.split(":").map(Number);
      const presetEnd = new Date(baseDate);
      presetEnd.setHours(endHour, endMin, 0, 0);

      return new Date() >= presetEnd;
   } catch {
      return false;
   }
};

// Calculate smart initial default date and preset
const getSmartInitialDefaults = (todayStr: string) => {
   // Find the first preset that has not expired for today
   const validTodayPreset = interviewerDashboardData.slotPresets.find(
      (preset) => !isPresetExpired(preset, todayStr, todayStr)
   );

   if (validTodayPreset) {
      return {
         date: todayStr,
         start: validTodayPreset.start,
         end: validTodayPreset.end
      };
   }

   // If all presets today have passed, default to tomorrow with the first preset (Morning)
   const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd");
   const firstPreset = interviewerDashboardData.slotPresets[0];

   return {
      date: tomorrowStr,
      start: firstPreset?.start || "09:00",
      end: firstPreset?.end || "12:00"
   };
};

export const AddSlotModal = ({ open, existingSlots = [], onClose, onSuccess }: AddSlotModalProps) => {
   const todayStr = format(new Date(), "yyyy-MM-dd");

   const [selectedDate, setSelectedDate] = useState<string>(() => getSmartInitialDefaults(todayStr).date);
   const [startTime, setStartTime] = useState<string>(() => getSmartInitialDefaults(todayStr).start);
   const [endTime, setEndTime] = useState<string>(() => getSmartInitialDefaults(todayStr).end);
   const [slotDuration, setSlotDuration] = useState<number>(60);
   const [unselectedSlotKeys, setUnselectedSlotKeys] = useState<Set<string>>(new Set());

   const { isPending, error, mutate } = useMutation(createAvailabilitySlots);

   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error]);

   // Reset to smart defaults whenever modal opens
   useEffect(() => {
      if (open) {
         const defaults = getSmartInitialDefaults(todayStr);
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setSelectedDate(defaults.date);
         setStartTime(defaults.start);
         setEndTime(defaults.end);
         setUnselectedSlotKeys(new Set());
      }
   }, [open, todayStr]);

   // Auto-generate slot intervals based on date, start, end, duration and existing slot overlaps
   const generatedSlots: GeneratedSlotItem[] = useMemo(() => {
      if (!selectedDate || !startTime || !endTime) return [];

      try {
         const baseDate = parse(selectedDate, "yyyy-MM-dd", new Date());
         const [startHour, startMin] = startTime.split(":").map(Number);
         const [endHour, endMin] = endTime.split(":").map(Number);

         let current = new Date(baseDate);
         current.setHours(startHour, startMin, 0, 0);

         const cutoff = new Date(baseDate);
         cutoff.setHours(endHour, endMin, 0, 0);

         const now = new Date();
         const slots: GeneratedSlotItem[] = [];

         while (current < cutoff) {
            const next = addMinutes(current, slotDuration);
            if (next > cutoff) break;

            if (current > now) {
               const slotStartIso = current.toISOString();
               const currentMs = current.getTime();
               const nextMs = next.getTime();

               // Check if this interval overlaps with any existing configured availability slot
               const isOverlapping = existingSlots.some((s) => {
                  const exStartMs = new Date(s.startTime).getTime();
                  const exEndMs = new Date(s.endTime).getTime();
                  return exStartMs < nextMs && exEndMs > currentMs;
               });

               slots.push({
                  startTime: slotStartIso,
                  endTime: next.toISOString(),
                  displayStart: format(current, "p"),
                  displayEnd: format(next, "p"),
                  selected: !isOverlapping && !unselectedSlotKeys.has(slotStartIso),
                  isOverlapping
               });
            }
            current = next;
         }

         return slots;
      } catch {
         return [];
      }
   }, [selectedDate, startTime, endTime, slotDuration, unselectedSlotKeys, existingSlots]);

   // Toggle slot selection by its unique startTime key
   const toggleSlot = (slotKey: string) => {
      setUnselectedSlotKeys((prev) => {
         const updated = new Set(prev);
         if (updated.has(slotKey)) {
            updated.delete(slotKey);
         } else {
            updated.add(slotKey);
         }
         return updated;
      });
   };

   // Apply preset to set start and end time
   const applyPreset = (preset: { start: string; end: string; }) => {
      setStartTime(preset.start);
      setEndTime(preset.end);
      setUnselectedSlotKeys(new Set());
   };

   // Handle save action
   const handleSave = async () => {
      const activeSlots = generatedSlots
         .filter((s) => s.selected && !s.isOverlapping)
         .map((s) => ({
            startTime: s.startTime,
            endTime: s.endTime
         }));

      if (activeSlots.length === 0) {
         toast.error("Please select at least one valid future slot.");
         return;
      }

      const res = await mutate({ slots: activeSlots });
      if (res) {
         if (res.skipped > 0) {
            toast.success(`Added ${res.count} slots (${res.skipped} skipped due to existing schedule).`);
         } else {
            toast.success(`Successfully added ${res.count} availability slots.`);
         }
         onSuccess();
         onClose();
      }
   };

   return (
      <ModalWrapper
         open={open}
         onClose={onClose}
         title="Add Availability Slots"
         description="Choose a date and time window. The scheduler will automatically split your window into bookable slots."
         headerIcon={<ClockFading className="w-4 h-4 text-violet-400" />}
      >
         <div className="py-5 space-y-6 text-zinc-100 font-inter">
            {/* Quick Presets */}
            <div className="space-y-2">
               <Label className="text-xs font-semibold uppercase text-zinc-400">Quick Presets</Label>
               <div className="flex flex-wrap gap-2">
                  {interviewerDashboardData.slotPresets.map((preset, idx) => {
                     const isExpired = isPresetExpired(preset, selectedDate, todayStr);
                     const isActive = !isExpired && preset.start === startTime && preset.end === endTime;

                     return (
                        <Button
                           key={idx}
                           type="button"
                           disabled={isExpired}
                           onClick={() => applyPreset(preset)}
                           className={cn(
                              "px-3 py-1.5 rounded-md text-xs border transition-colors max-sm:w-full",
                              isExpired
                                 ? "bg-zinc-900/20 text-zinc-600 border-white/5 cursor-not-allowed line-through"
                                 : isActive
                                    ? "bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/20 text-violet-300 font-semibold shadow-xs"
                                    : "bg-zinc-900/60 border-white/8 hover:border-violet-500/40 hover:bg-violet-500/10 text-zinc-300"
                           )}
                        >
                           {preset.label}
                        </Button>
                     );
                  })}
               </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {/* Date Picker */}
               <div className="space-y-2">
                  <Label htmlFor="slot-date" className="text-xs font-medium text-zinc-300">
                     Date
                  </Label>
                  <div className="relative">
                     <Input
                        id="slot-date"
                        type="date"
                        min={todayStr}
                        value={selectedDate}
                        onChange={(e) => {
                           const newDate = e.target.value;
                           setSelectedDate(newDate);
                           setUnselectedSlotKeys(new Set());

                           // If switching to today and currently chosen preset is expired, auto-select first valid preset
                           if (newDate === todayStr) {
                              const isCurrentExpired = isPresetExpired(
                                 { start: startTime, end: endTime },
                                 newDate,
                                 todayStr
                              );
                              if (isCurrentExpired) {
                                 const firstValid = interviewerDashboardData.slotPresets.find(
                                    (p) => !isPresetExpired(p, newDate, todayStr)
                                 );
                                 if (firstValid) {
                                    setStartTime(firstValid.start);
                                    setEndTime(firstValid.end);
                                 }
                              }
                           }
                        }}
                        className="bg-zinc-900 border-white/10 text-zinc-200 scheme-dark h-10! text-sm!"
                     />
                  </div>
               </div>

               {/* Start Time */}
               <div className="space-y-2">
                  <Label htmlFor="start-time" className="text-xs font-medium text-zinc-300">
                     Start Time
                  </Label>
                  <Input
                     id="start-time"
                     type="time"
                     value={startTime}
                     onChange={(e) => {
                        setStartTime(e.target.value);
                        setUnselectedSlotKeys(new Set());
                     }}
                     className="bg-zinc-900 border-white/10 text-zinc-200 scheme-dark h-10! text-sm!"
                  />
               </div>

               {/* End Time */}
               <div className="space-y-2">
                  <Label htmlFor="end-time" className="text-xs font-medium text-zinc-300">
                     End Time
                  </Label>
                  <Input
                     id="end-time"
                     type="time"
                     value={endTime}
                     onChange={(e) => {
                        setEndTime(e.target.value);
                        setUnselectedSlotKeys(new Set());
                     }}
                     className="bg-zinc-900 border-white/10 text-zinc-200 scheme-dark h-10! text-sm!"
                  />
               </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
               <Label className="text-xs font-medium text-zinc-300">Slot Duration</Label>
               <div className="flex items-center gap-2.5">
                  <Badge
                     variant={slotDuration === 30 ? "default" : "outline"}
                     onClick={() => {
                        setSlotDuration(30);
                        setUnselectedSlotKeys(new Set());
                     }}
                     className={`
                     shrink-0 p-3.25 cursor-pointer transition-colors font-medium
                     ${slotDuration === 30 ? 'bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/20 text-violet-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'}
                  `}
                  >
                     30 Minutes
                  </Badge>
                  <Badge
                     variant={slotDuration === 60 ? "default" : "outline"}
                     onClick={() => {
                        setSlotDuration(60);
                        setUnselectedSlotKeys(new Set());
                     }}
                     className={`
                     shrink-0 p-3.25 cursor-pointer transition-colors font-medium
                     ${slotDuration === 60 ? 'bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/20 text-violet-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'}
                  `}
                  >
                     60 Minutes (Standard)
                  </Badge>
               </div>
            </div>

            {/* Generated Slots Preview */}
            <div className="space-y-3 pt-2 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                     Generated Slots Preview ({generatedSlots.filter((s) => s.selected).length} selected)
                  </Label>
               </div>

               {generatedSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2.5 pr-1">
                     {generatedSlots.map((slot) => {
                        if (slot.isOverlapping) {
                           return (
                              <CustomTooltip
                                 key={slot.startTime}
                                 content='Slot already exists'
                                 trigger={
                                    <Badge
                                       variant="outline"
                                       className="flex items-center justify-center gap-1.5 shrink-0 p-3.25 font-medium w-full bg-green-900/30 border-green-500/30 text-green-600 line-through opacity-60"
                                    >
                                       <span>{slot.displayStart} - {slot.displayEnd}</span>
                                    </Badge>
                                 }
                              />
                           );
                        }

                        return (
                           <Badge
                              key={slot.startTime}
                              variant={slot.selected ? "default" : "outline"}
                              onClick={() => toggleSlot(slot.startTime)}
                              className={`
                                 flex items-center justify-center gap-2 shrink-0 p-3.25 cursor-pointer transition-colors font-medium w-full
                                 ${slot.selected ? 'bg-green-500/15 border-green-500/30 hover:bg-green-500/20 text-green-300' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-zinc-100 hover:border-white/20'}
                              `}
                           >
                              <span>
                                 {slot.displayStart} - {slot.displayEnd}
                              </span>
                           </Badge>
                        );
                     })}
                  </div>
               ) : (
                  <div className="p-4 rounded-xl bg-zinc-900/30 border border-white/5 text-center text-xs text-zinc-500">
                     No future slots generated. Check that the date and time window are in the future.
                  </div>
               )}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
               <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending}
                  className="text-xs rounded-lg h-9 px-4.5"
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={isPending || generatedSlots.filter((s) => s.selected && !s.isOverlapping).length === 0}
                  className="bg-violet-600/90 hover:bg-violet-600 text-zinc-100 text-xs rounded-lg h-9 px-4.5 font-semibold flex items-center gap-1.5"
               >
                  {isPending ? <Spinner className="size-4" /> : <Plus className="w-4 h-4" />}
                  Save Slots
               </Button>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default AddSlotModal;
