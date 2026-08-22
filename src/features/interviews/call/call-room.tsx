"use client";

import ScreenLoader from '@/components/common/screen-loader';
import { CallData } from '@/features/interviews/call/types/call.types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import ScreenError from '@/components/common/screen-error';
import CallInterface from './components/call-interface';
import CallSetup from './components/call-setup';
import { toast } from 'sonner';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

interface CallRoomProps {
   callData: CallData;
   callId: string;
}

const CallRoom = ({ callData, callId }: CallRoomProps) => {
   const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
   const [call, setCall] = useState<Call | null>(null);
   const [isJoined, setIsJoined] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const { isInterviewer, token, currentUser, booking } = callData;

   const router = useRouter();

   // Initialize Stream Video Client
   useEffect(() => {
      let cancelled = false;

      if (!apiKey) {
         // eslint-disable-next-line react-hooks/set-state-in-effect
         setError('Video service is currently unavailable. Stream API key is missing.');
         return;
      }

      let client: StreamVideoClient | null = null;
      let callInstance: Call | null = null;

      try {
         client = new StreamVideoClient({
            apiKey,
            user: {
               id: currentUser.id,
               name: `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() || 'User',
               image: currentUser.imageUrl || '',
            },
            token,
            options: {
               logger: (logLevel, message) => {
                  if (
                     typeof message === 'string' &&
                     (message.includes('[devices]') || message.includes('getUserMedia'))
                  ) {
                     return;
                  }
                  if (logLevel === 'error') {
                     toast.error(message);
                  } else if (logLevel === 'warn') {
                     toast.error(message);
                  }
               }
            }
         });

         callInstance = client.call('default', callId);

         if (!cancelled) {
            setVideoClient(client);
            setCall(callInstance);
         }
      } catch {
         if (!cancelled) {
            setError('Failed to initialize video session. Please check your connection and try again.');
         }
      }

      return () => {
         cancelled = true;
         if (callInstance) {
            if (
               callInstance.state.callingState !== CallingState.LEFT &&
               callInstance.state.callingState !== CallingState.IDLE
            ) {
               callInstance.leave().catch(() => { /* no-op */ });
            }
         }
         if (client) {
            client.disconnectUser().catch(() => { /* no-op */ });
         }
         setVideoClient(null);
         setCall(null);
         setIsJoined(false);
      };

      // Only re-run when the call identity or auth actually changes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [callId, token, currentUser.id]);

   // Join the call
   const handleJoin = useCallback(async () => {
      if (!call) return;
      await call.join({ create: true });
      setIsJoined(true);
   }, [call]);

   // End the active call session without redirecting immediately
   const handleEndCall = useCallback(async () => {
      if (call) {
         if (call.state.callingState !== CallingState.LEFT && call.state.callingState !== CallingState.IDLE) {
            await call.leave().catch(() => { /* no-op */ });
         }
      }
   }, [call]);

   // Navigate user back to role dashboard / appointments
   const handleRedirect = useCallback(() => {
      if (typeof window !== 'undefined') {
         sessionStorage.removeItem(`evalo_joined_${booking.id}`);
      }
      router.push(isInterviewer ? '/dashboard' : '/appointments');
   }, [isInterviewer, router, booking.id]);

   // Error
   if (error) {
      return <ScreenError text={error} />;
   }

   // Loader
   if (!videoClient || !call) {
      return <ScreenLoader className='min-h-screen h-full' text="Initializing camera & microphone setup..." />;
   }

   return (
      <StreamVideo client={videoClient}>
         <StreamCall call={call}>
            {!isJoined ? (
               <CallSetup
                  booking={booking}
                  isInterviewer={isInterviewer}
                  currentUser={currentUser}
                  onJoin={handleJoin}
                  onCancel={handleRedirect}
               />
            ) : (
               <CallInterface
                  callId={callId}
                  isInterviewer={isInterviewer}
                  booking={booking}
                  onEndCall={() => { void handleEndCall(); }}
                  onNavigateOut={handleRedirect}
                  apiKey={apiKey || ''}
                  token={token}
                  currentUser={currentUser}
               />
            )}
         </StreamCall>
      </StreamVideo>
   );
};

export default CallRoom;