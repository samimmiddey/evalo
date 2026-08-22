import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/app-error";
import { db } from "@/lib/prisma";
import { serverError } from "@/lib/server-error";
import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";
import { GetCallDataServerResponse } from "../types/call.types";

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
            endTime: booking.endTime.toISOString()
         }
      };
   } catch (error: unknown) {
      return serverError({
         error,
         fallbackMessage: 'Failed to fetch call data'
      });
   }

};