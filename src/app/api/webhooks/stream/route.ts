import { db } from "@/lib/prisma";
import { FeedbackRating } from "@/generated/prisma/enums";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

interface StreamRecording {
   url: string;
}

interface StreamTranscription {
   url: string;
}

interface StreamWebhookBody {
   type: string;
   call_cid?: string;
   call_recording?: StreamRecording;
   call_transcription?: StreamTranscription;
}

interface TranscriptSpeechEntry {
   type: string;
   speaker_id: string;
   text: string;
}

interface FeedbackGeneratedData {
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: FeedbackRating;
}

export async function POST(request: NextRequest) {
   const body = (await request.json()) as StreamWebhookBody;
   const eventType = body.type;

   if (
      eventType !== 'call.transcription_ready' &&
      eventType !== 'call.recording_ready'
   ) {
      return new Response("Invalid Event Type", { status: 400 });
   }

   const callCid = body.call_cid ?? '';
   const streamCallId = callCid.includes(':') ? callCid.split(':')[1] : callCid;

   if (!streamCallId) {
      return new Response("Invalid Call CID", { status: 400 });
   }

   try {
      const booking = await db.booking.findUnique({
         where: { streamCallId },
         include: {
            interviewer: {
               select: { id: true, clerkUserId: true, firstName: true, lastName: true, expertise: true }
            },
            interviewee: {
               select: { id: true, clerkUserId: true, firstName: true, lastName: true }
            },
            feedback: { select: { id: true } }
         }
      });

      if (!booking) {
         return new Response("Booking Not Found", { status: 404 });
      }

      // Recording ready
      if (eventType === 'call.recording_ready') {
         const recordingUrl = body.call_recording?.url;

         if (!recordingUrl) {
            return new Response("Invalid Recording URL", { status: 400 });
         }

         await db.booking.update({
            where: { id: booking.id },
            data: { recordingUrl }
         });

         return new Response("Recording URL Saved", { status: 200 });
      }

      // Transcription ready
      if (eventType === 'call.transcription_ready') {
         if (booking.feedback) {
            return new Response("Feedback Already Generated", { status: 200 });
         }

         const transcriptionUrl = body.call_transcription?.url;

         if (!transcriptionUrl) {
            return new Response("Invalid Transcription URL", { status: 400 });
         }

         // Download JSONL from stream CDN as plain text
         const res = await fetch(transcriptionUrl);
         const rawTranscriptionText = await res.text();

         // Extract Transcript Speech Entries
         const lines = rawTranscriptionText
            .trim()
            .split('\n')
            .filter(Boolean)
            .map((line: string): TranscriptSpeechEntry | null => {
               try {
                  return JSON.parse(line) as TranscriptSpeechEntry;
               } catch {
                  return null;
               }
            })
            .filter((entry): entry is TranscriptSpeechEntry => entry !== null && entry.type === 'speech');

         if (lines.length === 0) {
            return new Response("No Speech Found", { status: 400 });
         }

         const speakerMap: Record<string, string> = {
            [booking.interviewer.clerkUserId]: `${booking.interviewer.firstName ?? ''} ${booking.interviewer.lastName ?? ''}`.trim() || 'Interviewer',
            [booking.interviewee.clerkUserId]: `${booking.interviewee.firstName ?? ''} ${booking.interviewee.lastName ?? ''}`.trim() || 'Candidate'
         };

         const transcriptText = lines
            .map((line) => {
               const speaker = speakerMap[line.speaker_id] ?? line.speaker_id;
               return `${speaker}: ${line.text}`;
            })
            .join('\n');

         const apiKey = process.env.GEMINI_API_KEY;

         if (!apiKey) {
            return new Response("No API Key", { status: 400 });
         }

         // Generate feedback via Gemini
         const genAI = new GoogleGenerativeAI(apiKey);
         const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
         const expertise = booking.interviewer.expertise.join(", ") || 'General';

         const prompt = `
            You are a technical interviewer conducting a mock interview for a candidate.
            
            Expertise area: ${expertise}
            Interviewer: ${booking.interviewer.firstName ?? ''} ${booking.interviewer.lastName ?? ''}
            Candidate: ${booking.interviewee.firstName ?? ''} ${booking.interviewee.lastName ?? ''}

            TRANSCRIPT:
            ${transcriptText}

            Analyze the candidate's performance. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
            {
               "summary": "2-3 sentence overall summary of the session",
               "technical": "Assessment of technical knowledge and accuracy",
               "communication": "Assessment of clarity, structure, and communication style",
               "problemSolving": "Assessment of problem-solving approach and thought process",
               "recommendation": "HIRE / CONSIDER / NO_HIRE with a one-sentence reason",
               "strengths": ["strength 1", "strength 2", "strength 3"],
               "improvements": ["improvement 1", "improvement 2", "improvement 3"],
               "overallRating": "POOR or AVERAGE or GOOD or EXCELLENT"
            }
         `;

         const result = await model.generateContent(prompt);
         const raw = result.response
            .text()
            .trim()
            .replace(/```(?:json)?/g, "")
            .replace(/```/g, "");

         const feedbackData = JSON.parse(raw) as FeedbackGeneratedData;

         await db.$transaction([
            db.feedback.upsert({
               where: { bookingId: booking.id },
               create: {
                  bookingId: booking.id,
                  summary: feedbackData.summary,
                  technical: feedbackData.technical,
                  communication: feedbackData.communication,
                  problemSolving: feedbackData.problemSolving,
                  recommendation: feedbackData.recommendation,
                  strengths: feedbackData.strengths,
                  improvements: feedbackData.improvements,
                  overallRating: feedbackData.overallRating,
               },
               update: {
                  summary: feedbackData.summary,
                  technical: feedbackData.technical,
                  communication: feedbackData.communication,
                  problemSolving: feedbackData.problemSolving,
                  recommendation: feedbackData.recommendation,
                  strengths: feedbackData.strengths,
                  improvements: feedbackData.improvements,
                  overallRating: feedbackData.overallRating,
               }
            }),
            db.booking.update({
               where: { id: booking.id },
               data: {
                  status: 'COMPLETED',
               }
            })
         ]);

         const earnExists = await db.creditTransaction.findFirst({
            where: {
               bookingId: booking.id,
               type: "BOOKING_EARNING"
            }
         });

         if (!earnExists) {
            await db.creditTransaction.create({
               data: {
                  userId: booking.interviewer.id,
                  amount: booking.creditsCharged,
                  type: "BOOKING_EARNING",
                  bookingId: booking.id
               }
            });
         }

         return new Response("Feedback & Credit Added", { status: 200 });
      }
   } catch {
      return new Response("Internal Server Error", { status: 500 });
   }

   return new Response("OK", { status: 200 });
}