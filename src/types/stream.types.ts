import { FeedbackRating } from "@/generated/prisma/enums";

export interface StreamRecording {
   url: string;
}

export interface StreamTranscription {
   url: string;
}

export interface StreamSessionParticipant {
   user?: {
      id: string;
      name?: string;
      role?: string;
   };
   user_session_id?: string;
   joined_at?: string;
   left_at?: string;
   duration?: number;
}

export interface StreamParticipantSessionRecord {
   user?: {
      id: string;
      name?: string;
      role?: string;
   } | string;
   user_id?: string;
   userId?: string;
   joined_at?: string | Date;
   left_at?: string | Date;
   duration_in_seconds?: number;
   duration?: number;
}

export interface StreamCallSession {
   id: string;
   started_at?: string;
   ended_at?: string;
   duration?: number;
   participants?: StreamSessionParticipant[];
   participants_count?: number;
   anonymous_participants_count?: number;
}

export interface StreamWebhookBody {
   type: string;
   call_cid?: string;
   session_id?: string;
   call_recording?: StreamRecording;
   call_transcription?: StreamTranscription;
   session?: StreamCallSession;
   call?: {
      id?: string;
      cid?: string;
      session?: StreamCallSession;
   };
}

export interface TranscriptSpeechEntry {
   type: string;
   speaker_id: string;
   text: string;
   start_time?: number;
   end_time?: number;
}

export interface FeedbackGeneratedData {
   summary: string;
   technical: string;
   communication: string;
   problemSolving: string;
   recommendation: string;
   strengths: string[];
   improvements: string[];
   overallRating: FeedbackRating;
}

export interface WebhookProcessResult {
   message: string;
   statusCode: number;
}
