import { db } from "@/lib/prisma";
import { MINIMUM_PRESENCE_RATIO } from "@/constants/interviews";
import { StreamParticipantSessionRecord, StreamWebhookBody, WebhookProcessResult } from "@/types/stream.types";
import { Prisma } from "@/generated/prisma/client";
import { StreamClient } from "@stream-io/node-sdk";

export interface TimeInterval {
   start: number;
   end: number;
}

const getParticipantUserId = (p: StreamParticipantSessionRecord): string => {
   if (typeof p.user === 'object' && p.user?.id) {
      return p.user.id;
   }
   return (
      p.user_id ??
      p.userId ??
      (typeof p.user === 'string' ? p.user : '') ??
      ''
   );
};

// 1. Clip raw intervals to scheduled booking window [windowStart, windowEnd]
export const clipInterval = (
   start: number,
   end: number,
   windowStart: number,
   windowEnd: number
): TimeInterval | null => {
   const clippedStart = Math.max(start, windowStart);
   const clippedEnd = Math.min(end, windowEnd);
   return clippedEnd > clippedStart ? { start: clippedStart, end: clippedEnd } : null;
};

// 2. Merge overlapping intervals per user (Immutable Union)
export const mergeIntervals = (intervals: TimeInterval[]): TimeInterval[] => {
   if (intervals.length === 0) return [];
   const sorted = [...intervals].sort((a, b) => a.start - b.start);
   const merged: TimeInterval[] = [{ start: sorted[0].start, end: sorted[0].end }];

   for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
         last.end = Math.max(last.end, current.end);
      } else {
         merged.push({ start: current.start, end: current.end });
      }
   }
   return merged;
};

// 3. Compute simultaneous co-presence between merged sets (Intersection)
export const computeIntersectionSeconds = (
   intervalsA: TimeInterval[],
   intervalsB: TimeInterval[]
): number => {
   let totalOverlapMs = 0;
   for (const a of intervalsA) {
      for (const b of intervalsB) {
         const overlapStart = Math.max(a.start, b.start);
         const overlapEnd = Math.min(a.end, b.end);
         if (overlapEnd > overlapStart) {
            totalOverlapMs += overlapEnd - overlapStart;
         }
      }
   }
   return Math.floor(totalOverlapMs / 1000);
};

// Atomically marks a booking as COMPLETED and credits the interviewer
export const settleSuccessfulSession = async (
   bookingId: string,
   creditsCharged: number,
   interviewerId: string,
   prismaClient: Prisma.TransactionClient = db
): Promise<void> => {
   // Atomic status update: only updates if booking is currently SCHEDULED
   const { count } = await prismaClient.booking.updateMany({
      where: { id: bookingId, status: 'SCHEDULED' },
      data: { status: 'COMPLETED' }
   });

   // If already completed, cancelled, or expired, safely abort to prevent double-crediting
   if (count === 0) {
      return;
   }

   await prismaClient.user.update({
      where: { id: interviewerId },
      data: {
         creditBalance: {
            increment: creditsCharged
         }
      }
   });

   await prismaClient.creditTransaction.create({
      data: {
         userId: interviewerId,
         amount: creditsCharged,
         type: 'BOOKING_EARNING',
         bookingId
      }
   });
};

// Atomically marks a booking as EXPIRED
export const settleExpiredSession = async (
   bookingId: string,
   prismaClient: Prisma.TransactionClient = db
): Promise<void> => {
   await prismaClient.booking.updateMany({
      where: { id: bookingId, status: 'SCHEDULED' },
      data: { status: 'EXPIRED' }
   });
};

// Processes Stream business webhooks (call.session_ended and call.stats_report_ready)
export const processStreamBusinessWebhook = async (
   body: StreamWebhookBody
): Promise<WebhookProcessResult> => {
   const callCid = body.call_cid ?? body.call?.cid ?? '';
   const streamCallId = callCid.includes(':') ? callCid.split(':')[1] : (body.call?.id ?? callCid);
   const sessionId = body.session_id ?? body.call?.session?.id ?? body.session?.id;

   if (!streamCallId || !sessionId) {
      return { message: "Invalid Call CID or Session ID", statusCode: 400 };
   }

   const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
   const secretKey = process.env.STREAM_SECRET_KEY;
   if (!apiKey || !secretKey) {
      return { message: "Missing Stream API credentials", statusCode: 500 };
   }

   const streamClient = new StreamClient(apiKey, secretKey);

   try {
      const booking = await db.booking.findUnique({
         where: { streamCallId },
         include: {
            interviewer: {
               select: { id: true, clerkUserId: true }
            },
            candidate: {
               select: { id: true, clerkUserId: true }
            }
         }
      });

      if (!booking) {
         return { message: "Booking Not Found", statusCode: 404 };
      }

      if (booking.status !== 'SCHEDULED') {
         return { message: `Session already finalized with status ${booking.status}`, statusCode: 200 };
      }

      // Query complete participant records from Stream SDK with pagination
      const call = streamClient.video.call("default", streamCallId);
      const allParticipants: StreamParticipantSessionRecord[] = [];
      let nextCursor: string | undefined = undefined;

      do {
         const res = await call.queryCallParticipantSessions({
            session: sessionId,
            limit: 100,
            ...(nextCursor ? { next: nextCursor } : {})
         }) as { participants_sessions?: StreamParticipantSessionRecord[]; next?: string };
         const items = res.participants_sessions ?? [];
         allParticipants.push(...items);
         nextCursor = res.next;
      } while (nextCursor);

      const sessionEndedAt = body.call?.session?.ended_at ?? body.session?.ended_at;
      const bookingStartMs = booking.startTime.getTime();
      const bookingEndMs = booking.endTime.getTime();

      const extractInterval = (p: StreamParticipantSessionRecord): TimeInterval | null => {
         if (!p.joined_at) return null;
         const start = new Date(p.joined_at).getTime();
         let end = 0;

         if (p.left_at) {
            end = new Date(p.left_at).getTime();
         } else if (typeof p.duration_in_seconds === 'number' && p.duration_in_seconds > 0) {
            end = start + p.duration_in_seconds * 1000;
         } else if (typeof p.duration === 'number' && p.duration > 0) {
            end = start + p.duration * 1000;
         } else if (sessionEndedAt) {
            end = new Date(sessionEndedAt).getTime();
         }

         if (start <= 0 || end <= start) return null;
         return clipInterval(start, end, bookingStartMs, bookingEndMs);
      };

      const interviewerIntervals = mergeIntervals(
         allParticipants
            .filter((p) => getParticipantUserId(p) === booking.interviewer.clerkUserId)
            .map(extractInterval)
            .filter((i): i is TimeInterval => i !== null)
      );

      const candidateIntervals = mergeIntervals(
         allParticipants
            .filter((p) => getParticipantUserId(p) === booking.candidate.clerkUserId)
            .map(extractInterval)
            .filter((i): i is TimeInterval => i !== null)
      );

      const sessionCoPresence = computeIntersectionSeconds(interviewerIntervals, candidateIntervals);

      // Atomic monotonic write: update only if new value is higher, insert if missing
      const { count } = await db.bookingSession.updateMany({
         where: {
            bookingId: booking.id,
            streamSessionId: sessionId,
            coPresenceSeconds: { lt: sessionCoPresence }
         },
         data: {
            coPresenceSeconds: sessionCoPresence
         }
      });

      if (count === 0) {
         await db.bookingSession.createMany({
            data: [
               {
                  bookingId: booking.id,
                  streamSessionId: sessionId,
                  coPresenceSeconds: sessionCoPresence
               }
            ],
            skipDuplicates: true
         });
      }

      // Sum all recorded sessions for this booking
      const totals = await db.bookingSession.aggregate({
         where: { bookingId: booking.id },
         _sum: { coPresenceSeconds: true }
      });

      const totalCoPresenceSeconds = totals._sum.coPresenceSeconds ?? 0;
      const scheduledDurationSeconds = Math.max(
         60,
         Math.floor((booking.endTime.getTime() - booking.startTime.getTime()) / 1000)
      );
      const requiredPresenceSeconds = scheduledDurationSeconds * MINIMUM_PRESENCE_RATIO;

      // Settlement Check: if accumulated presence meets threshold, settle immediately
      if (totalCoPresenceSeconds >= requiredPresenceSeconds) {
         await db.$transaction(async (tx) => {
            await settleSuccessfulSession(booking.id, booking.creditsCharged, booking.interviewer.id, tx);
         });
         return {
            message: `Session qualified (${totalCoPresenceSeconds}s >= ${requiredPresenceSeconds}s) and settled as COMPLETED`,
            statusCode: 200
         };
      }

      return {
         message: `Session recorded with ${sessionCoPresence}s (total: ${totalCoPresenceSeconds}s / required: ${requiredPresenceSeconds}s). Remains SCHEDULED.`,
         statusCode: 200
      };
   } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to process stream webhook:", error);
      return { message: "Internal Server Error", statusCode: 500 };
   }
};

// Reconciles any past-due bookings for a user by flipping expired scheduled bookings' status to EXPIRED after 15 minutes grace period
export const reconcileExpiredBookings = async (
   userId: string,
   role: 'CANDIDATE' | 'INTERVIEWER'
): Promise<void> => {
   try {
      // Only expire bookings where the 15-minute post-slot grace period has passed
      const expiryThreshold = new Date(Date.now() - 15 * 60 * 1000);
      const whereCondition: Prisma.BookingWhereInput = {
         status: 'SCHEDULED',
         endTime: { lt: expiryThreshold },
         ...(role === 'CANDIDATE' ? { candidateId: userId } : { interviewerId: userId })
      };

      await db.booking.updateMany({
         where: whereCondition,
         data: {
            status: 'EXPIRED'
         }
      });
   } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Lazy reconciliation error:", error);
   }
};
