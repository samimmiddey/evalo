import { db } from "@/lib/prisma";
import { StreamParticipantSessionRecord, StreamWebhookBody, WebhookProcessResult } from "@/types/stream.types";
import { CompletionReason } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { StreamClient } from "@stream-io/node-sdk";
import {
   CANDIDATE_NO_SHOW_MAX_RATIO,
   HOST_WAIT_RATIO,
   MINIMUM_PRESENCE_RATIO
} from "@/constants/interviews";

export interface SettlementDecisionParams {
   scheduledDurationSeconds: number;
   totalCoPresence: number;
   totalInterviewer: number;
   totalCandidate: number;
   presenceVerified: boolean;
   effectiveEnd: number | null;
   bookingEndTimeMs: number;
}

// Pure decision function to determine settlement qualification for an interview booking
export const determineSettlementOutcome = (
   params: SettlementDecisionParams
): CompletionReason | null => {
   // Case 1: Mutual Session Completion (>= 50% simultaneous co-presence) -> 'MUTUAL'
   if (params.totalCoPresence >= params.scheduledDurationSeconds * MINIMUM_PRESENCE_RATIO) {
      return CompletionReason.MUTUAL;
   }

   // Case 2: Candidate No-Show Host Compensation (Slot finished, host waited >= 85%, candidate <= 5%, presence verified) -> 'CANDIDATE_NO_SHOW'
   const isPastSlotEnd = params.effectiveEnd !== null && params.effectiveEnd >= params.bookingEndTimeMs;
   if (
      isPastSlotEnd &&
      params.presenceVerified &&
      params.totalInterviewer >= params.scheduledDurationSeconds * HOST_WAIT_RATIO &&
      params.totalCandidate <= params.scheduledDurationSeconds * CANDIDATE_NO_SHOW_MAX_RATIO
   ) {
      return CompletionReason.CANDIDATE_NO_SHOW;
   }

   // 3. Indeterminate / Incomplete -> null (Session remains SCHEDULED)
   return null;
};

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

// Sum total seconds across an array of time intervals
export const sumIntervalSeconds = (intervals: TimeInterval[]): number =>
   intervals.reduce((acc, { start, end }) => acc + Math.floor((end - start) / 1000), 0);

// Atomically marks a booking as COMPLETED and credits the interviewer
export const settleSuccessfulSession = async (
   bookingId: string,
   creditsCharged: number,
   interviewerId: string,
   reason: CompletionReason = CompletionReason.MUTUAL,
   prismaClient: Prisma.TransactionClient = db
): Promise<boolean> => {
   // Atomic status update: only updates if booking is currently SCHEDULED
   const { count } = await prismaClient.booking.updateMany({
      where: { id: bookingId, status: 'SCHEDULED' },
      data: {
         status: 'COMPLETED',
         completionReason: reason
      }
   });

   // If already completed, cancelled, or expired, safely abort to prevent double-crediting
   if (count === 0) {
      return false;
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
         reason,
         bookingId
      }
   });

   return true;
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
         }) as { participants_sessions?: StreamParticipantSessionRecord[]; next?: string; };
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

      const sessionInterviewerSeconds = sumIntervalSeconds(interviewerIntervals);
      const sessionCandidateSeconds = sumIntervalSeconds(candidateIntervals);
      const sessionCoPresence = computeIntersectionSeconds(interviewerIntervals, candidateIntervals);

      // Verify participant identity matching sanity
      const interviewerClerkId = booking.interviewer.clerkUserId;
      const candidateClerkId = booking.candidate.clerkUserId;

      const unmatchedCount = allParticipants.filter((p) => {
         const id = getParticipantUserId(p);
         return id !== interviewerClerkId && id !== candidateClerkId;
      }).length;

      const presenceVerified = interviewerIntervals.length > 0 && unmatchedCount === 0;

      if (unmatchedCount > 0) {
         // eslint-disable-next-line no-console
         console.warn(
            `[Stream Webhook] ${unmatchedCount} unmatched participant(s) for booking ${booking.id}, session ${sessionId}. No-show branch blocked.`
         );
      }

      // Deterministic effectiveEnd calculation
      const maxLeftAt = allParticipants
         .map((p) => (p.left_at ? new Date(p.left_at).getTime() : 0))
         .reduce((max, t) => Math.max(max, t), 0);

      const effectiveEnd: number | null = sessionEndedAt
         ? new Date(sessionEndedAt).getTime()
         : maxLeftAt > 0
            ? maxLeftAt
            : null;

      if (effectiveEnd === null) {
         // eslint-disable-next-line no-console
         console.warn(
            `[Stream Webhook] effectiveEnd is indeterminate for booking ${booking.id}, session ${sessionId}. Host no-show decision will fail closed until slot conclusion is verified.`
         );
      }

      // Atomic 3-column monotonic upsert using PostgreSQL's GREATEST
      await db.$executeRaw`
         INSERT INTO "BookingSession" (
            "id",
            "bookingId",
            "streamSessionId",
            "coPresenceSeconds",
            "interviewerPresenceSeconds",
            "candidatePresenceSeconds",
            "updatedAt"
         )
         VALUES (
            ${crypto.randomUUID()},
            ${booking.id},
            ${sessionId},
            ${sessionCoPresence},
            ${sessionInterviewerSeconds},
            ${sessionCandidateSeconds},
            NOW()
         )
         ON CONFLICT ("bookingId", "streamSessionId") DO UPDATE SET
            "coPresenceSeconds" = GREATEST("BookingSession"."coPresenceSeconds", EXCLUDED."coPresenceSeconds"),
            "interviewerPresenceSeconds" = GREATEST("BookingSession"."interviewerPresenceSeconds", EXCLUDED."interviewerPresenceSeconds"),
            "candidatePresenceSeconds" = GREATEST("BookingSession"."candidatePresenceSeconds", EXCLUDED."candidatePresenceSeconds"),
            "updatedAt" = NOW()
      `;

      // Sum all recorded sessions for this booking
      const totals = await db.bookingSession.aggregate({
         where: { bookingId: booking.id },
         _sum: {
            coPresenceSeconds: true,
            interviewerPresenceSeconds: true,
            candidatePresenceSeconds: true
         }
      });

      const scheduledDurationSeconds = Math.max(
         60,
         Math.floor((booking.endTime.getTime() - booking.startTime.getTime()) / 1000)
      );

      const cap = (val: number | null) => Math.min(val ?? 0, scheduledDurationSeconds);

      const totalCoPresence = cap(totals._sum.coPresenceSeconds);
      const totalInterviewer = cap(totals._sum.interviewerPresenceSeconds);
      const totalCandidate = cap(totals._sum.candidatePresenceSeconds);

      // Determine settlement outcome via pure decision function
      const outcome = determineSettlementOutcome({
         scheduledDurationSeconds,
         totalCoPresence,
         totalInterviewer,
         totalCandidate,
         presenceVerified,
         effectiveEnd,
         bookingEndTimeMs: booking.endTime.getTime()
      });

      if (outcome) {
         await db.$transaction(async (tx) => {
            await settleSuccessfulSession(
               booking.id,
               booking.creditsCharged,
               booking.interviewer.id,
               outcome,
               tx
            );
         });
         return {
            message:
               outcome === CompletionReason.MUTUAL
                  ? `Session qualified as MUTUAL (${totalCoPresence}s co-presence) and settled as COMPLETED`
                  : `Session qualified as CANDIDATE_NO_SHOW (Host: ${totalInterviewer}s / Candidate: ${totalCandidate}s) and settled as COMPLETED`,
            statusCode: 200
         };
      }

      return {
         message: `Session recorded (co-presence: ${totalCoPresence}s, interviewer: ${totalInterviewer}s, candidate: ${totalCandidate}s). Remains SCHEDULED.`,
         statusCode: 200
      };
   } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to process stream webhook:", error);
      return { message: "Internal Server Error", statusCode: 500 };
   }
};
