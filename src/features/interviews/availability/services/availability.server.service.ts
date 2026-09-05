import { db } from "@/lib/prisma";
import { getAuthenticatedInterviewer } from "../../shared/services/shared.server.service";
import { AvailabilitySlot } from "../types/availability.types";
import { serverError } from "@/lib/server-error";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/lib/app-error";
import { createAvailabilitySlotsSchema, CreateAvailabilitySlotsSchemaTypes } from "../schemas/availability.schema";

// Get Availability Slots
export const getAvailabilitySlots = async (): Promise<AvailabilitySlot[]> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const slots = await db.availability.findMany({
         where: {
            interviewerId: interviewer.id,
            endTime: { gte: new Date() }
         },
         orderBy: { startTime: "asc" }
      });

      return slots.map((s) => ({
         id: s.id,
         startTime: s.startTime.toISOString(),
         endTime: s.endTime.toISOString(),
         status: s.status
      }));
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to fetch availability slots"
      });
   }
};

// Create Availability Slots
export const createAvailabilitySlots = async (
   data: CreateAvailabilitySlotsSchemaTypes
): Promise<{ count: number; skipped: number; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();
      const parsed = createAvailabilitySlotsSchema.parse(data);

      const validSlots = parsed.slots
         .map((slot) => ({
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime)
         }))
         .filter((slot) => slot.startTime > new Date() && slot.endTime > slot.startTime);

      if (validSlots.length === 0) {
         throw new ValidationError("No valid future slots provided");
      }

      // Calculate time boundaries of incoming batch
      const minStartTime = new Date(Math.min(...validSlots.map((s) => s.startTime.getTime())));
      const maxEndTime = new Date(Math.max(...validSlots.map((s) => s.endTime.getTime())));

      // Fetch all existing slots for this interviewer that overlap with the batch bounding window
      const existing = await db.availability.findMany({
         where: {
            interviewerId: interviewer.id,
            startTime: { lt: maxEndTime },
            endTime: { gt: minStartTime }
         },
         select: { startTime: true, endTime: true }
      });

      // Filter out slots that overlap with any existing slot:
      // Overlap condition: existing.startTime < candidate.endTime && existing.endTime > candidate.startTime
      const slotsToInsert = validSlots
         .filter((candidate) => {
            const hasOverlap = existing.some(
               (ex) => ex.startTime < candidate.endTime && ex.endTime > candidate.startTime
            );
            return !hasOverlap;
         })
         .map((s) => ({
            interviewerId: interviewer.id,
            startTime: s.startTime,
            endTime: s.endTime,
            status: "AVAILABLE" as const
         }));

      if (slotsToInsert.length === 0) {
         throw new ConflictError("The selected slots already exist or overlap with your existing availability.");
      }

      const result = await db.availability.createMany({
         data: slotsToInsert
      });

      const skippedCount = validSlots.length - result.count;

      return { count: result.count, skipped: skippedCount };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to create availability slots"
      });
   }
};

// Delete Availability Slot
export const deleteAvailabilitySlot = async (slotId: string): Promise<{ success: boolean; }> => {
   try {
      const interviewer = await getAuthenticatedInterviewer();

      const slot = await db.availability.findUnique({
         where: { id: slotId }
      });

      if (!slot) {
         throw new NotFoundError("Slot not found");
      }

      if (slot.interviewerId !== interviewer.id) {
         throw new ForbiddenError("Unauthorized to delete this slot");
      }

      if (slot.status === "BOOKED") {
         throw new ValidationError("Cannot delete a booked slot. Please cancel the booking first.");
      }

      await db.availability.delete({
         where: { id: slotId }
      });

      return { success: true };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: "Failed to delete availability slot"
      });
   }
};