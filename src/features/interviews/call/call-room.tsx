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
import CallCountdown from './components/call-countdown';
import CallExpired from './components/call-expired';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

interface CallRoomProps {
   callData: CallData;
   callId: string;
}

const CallRoom = ({ callData, callId }: CallRoomProps) => {
   const { isInterviewer, token, currentUser, booking } = callData;
   const router = useRouter();

   const startTimeMs = new Date(booking.startTime).getTime();
   const endTimeMs = new Date(booking.endTime).getTime();
   const earlyWindowMs = startTimeMs - 10 * 60 * 1000; // 10 minutes before start
   const lateWindowMs = endTimeMs + 15 * 60 * 1000; // 15 minutes after end

   const getInitialWindowStatus = (): 'early' | 'active' | 'expired' => {
      if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
         return 'expired';
      }
      const now = Date.now();
      if (now < earlyWindowMs) {
         return 'early';
      }
      if (now > lateWindowMs) {
         return 'expired';
      }
      return 'active';
   };

   const [windowStatus, setWindowStatus] = useState<'early' | 'active' | 'expired'>(getInitialWindowStatus);
   const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
   const [call, setCall] = useState<Call | null>(null);
   const [isJoined, setIsJoined] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // Initialize Stream Video Client only when call window is active
   useEffect(() => {
      if (windowStatus !== 'active') return;

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
               logger: (_logLevel, message) => {
                  if (
                     typeof message === 'string' &&
                     (
                        message.includes('[devices]') ||
                        message.includes('[audio manager]') ||
                        message.includes('speaking while muted') ||
                        message.includes('getUserMedia') ||
                        message.includes('device')
                     )
                  ) {
                     return;
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
   }, [callId, token, currentUser.id, windowStatus]);

   // Join the call
   const handleJoin = useCallback(async () => {
      if (!call) return;
      await call.join({ create: true });
      setIsJoined(true);
   }, [call]);

   // End the active call session without redirecting immediately
   const handleEndCall = useCallback(async () => {
      if (call) {
         if (isInterviewer) {
            await call.endCall().catch(() => { /* no-op */ });
         } else {
            if (call.state.callingState !== CallingState.LEFT && call.state.callingState !== CallingState.IDLE) {
               await call.leave().catch(() => { /* no-op */ });
            }
         }
      }
   }, [call, isInterviewer]);

   // Navigate user back to role dashboard / appointments
   const handleRedirect = useCallback(() => {
      if (typeof window !== 'undefined') {
         sessionStorage.removeItem(`evalo_joined_${booking.id}`);
      }
      router.push(isInterviewer ? '/dashboard' : '/appointments');
   }, [isInterviewer, router, booking.id]);

   // Early countdown screen
   if (windowStatus === 'early') {
      return (
         <CallCountdown
            booking={booking}
            isInterviewer={isInterviewer}
            onWindowOpen={() => setWindowStatus('active')}
            onCancel={handleRedirect}
         />
      );
   }

   // Expired or already finished session screen
   if (windowStatus === 'expired') {
      return (
         <CallExpired
            isInterviewer={isInterviewer}
            onNavigateOut={handleRedirect}
            status={booking.status}
         />
      );
   }

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