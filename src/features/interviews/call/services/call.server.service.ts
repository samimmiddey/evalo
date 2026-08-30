import { ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { CompleteCallData, GeneratedQuestion, GetCallDataServerResponse } from "../types/call.types";
import { EXPERTISE_PROMPTS } from "@/data/interviews/interviews.data";
import { InterviewExpertise } from "@/generated/prisma/enums";
import { GoogleGenerativeAI, ResponseSchema, SchemaType } from '@google/generative-ai';

export const getCallData = async (callId: string): Promise<GetCallDataServerResponse> => {
   const user = await currentUser();

   // Check if user exists
   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   try {
      // Get booking details along with interviewer and interviewee details
      const booking = await db.booking.findUnique({
         where: {
            streamCallId: callId
         },
         include: {
            interviewer: {
               select: {
                  id: true,
                  clerkUserId: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                  expertise: true,
                  experience: true,
                  designation: true
               }
            },
            interviewee: {
               select: {
                  id: true,
                  clerkUserId: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true
               }
            }
         }
      });

      // Check if booking exists
      if (!booking) {
         throw new NotFoundError('Call not found');
      }

      const isInterviewer = booking.interviewer.clerkUserId === user.id;
      const isInterviewee = booking.interviewee.clerkUserId === user.id;

      // Check if user is authorized to access this call
      if (!isInterviewer && !isInterviewee) {
         throw new ForbiddenError('User is not authorized to access this call');
      }

      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
      const secretKey = process.env.STREAM_SECRET_KEY;

      // Check if Stream API key and secret key are present
      if (!apiKey || !secretKey) {
         throw new Error("Missing Stream environment variables");
      }

      const streamClient = new StreamClient(apiKey, secretKey);

      // Generate Stream token for the user
      const token = streamClient.generateUserToken({
         user_id: user.id,
         validity_in_seconds: 60 * 60
      });

      return {
         token,
         isInterviewer,
         currentUser: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
         },
         booking: {
            id: booking.id,
            interviewer: booking.interviewer,
            interviewee: booking.interviewee,
            expertise: booking.interviewer.expertise,
            experience: booking.interviewer.experience,
            designation: booking.interviewer.designation,
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
            status: booking.status
         }
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch call data'
      });
   }
};

// Complete call session (host only)
export const completeCall = async (callId: string): Promise<CompleteCallData> => {
   const user = await currentUser();

   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   try {
      const booking = await db.booking.findUnique({
         where: {
            streamCallId: callId
         },
         include: {
            interviewer: {
               select: {
                  clerkUserId: true
               }
            }
         }
      });

      if (!booking) {
         throw new NotFoundError('Call not found');
      }

      const isInterviewer = booking.interviewer.clerkUserId === user.id;

      if (!isInterviewer) {
         throw new ForbiddenError('Only the host can mark the call as completed');
      }

      if (booking.status !== 'COMPLETED') {
         await db.booking.update({
            where: { id: booking.id },
            data: { status: 'COMPLETED' }
         });
      }

      return {
         bookingId: booking.id,
         status: 'COMPLETED'
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to complete call'
      });
   }
};

const questionSchema: ResponseSchema = {
   type: SchemaType.ARRAY,
   description: "List of exactly 3 concise technical interview questions",
   items: {
      type: SchemaType.OBJECT,
      properties: {
         id: {
            type: SchemaType.STRING,
            description: "Identifier e.g. q1, q2, q3"
         },
         title: {
            type: SchemaType.STRING,
            description: "Short concept title (2-4 words)"
         },
         question: {
            type: SchemaType.STRING,
            description: "Clear, direct technical question"
         },
         difficulty: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["EASY", "MEDIUM", "HARD"],
            description: "Difficulty level of the question"
         },
         expectedAnswer: {
            type: SchemaType.STRING,
            description: "Brief 1-2 sentence model answer for evaluation"
         },
         followUpQuestion: {
            type: SchemaType.STRING,
            description: "1 concise follow-up probe"
         }
      },
      required: ["id", "title", "question", "difficulty", "expectedAnswer"]
   }
};

// Generate AI interview questions
export const generateInterviewQuestions = async (expertise: string): Promise<GeneratedQuestion[]> => {
   const user = await currentUser();

   // Check if user exists
   if (!user) {
      throw new UnauthorizedError('Unauthenticated user');
   }

   const promptTopics = EXPERTISE_PROMPTS[expertise as InterviewExpertise];
   if (!promptTopics) {
      throw new ValidationError('Invalid expertise domain');
   }

   const apiKey = process.env.GEMINI_API_KEY;
   if (!apiKey) {
      throw new Error("Missing Gemini API key in environment variables");
   }

   const genAI = new GoogleGenerativeAI(apiKey);
   const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
         responseMimeType: "application/json",
         responseSchema: questionSchema,
         temperature: 0.7,
      }
   });

   const prompt = `
   You are a Senior Technical Interviewer in ${expertise}. Focus topics: ${promptTopics}.

   Generate exactly 3 concise, practical interview questions (1 Easy, 1 Medium, 1 Hard).
   - Keep "title" under 4 words.
   - Keep "question" clear and direct.
   - Keep "expectedAnswer" strictly under 2 concise sentences.
   - Keep "followUpQuestion" to 1 direct sentence.
   `;

   try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) {
         throw new Error("No response received from Gemini");
      }

      const questions = JSON.parse(text) as GeneratedQuestion[];
      return questions;
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to generate interview questions'
      });
   }
};