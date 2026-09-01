"use client";

import { useCallback, useEffect, useState } from 'react';
import { Booking } from '@/features/interviews/call/types/call.types';
import { CallingState, useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useCreateChatClient } from 'stream-chat-react';
import { Channel, ChannelData } from 'stream-chat';
import ScreenLoader from '@/components/common/screen-loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import CallHeader from './call-header';
import VideoPanel from './video-panel';
import ChatPanel from './chat-panel';
import TabSwitcher from './tab-switcher';
import CardLayout from '@/components/layouts/card-layout';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import { handleCompleteCall } from '../services/call.client.service';

interface CallInterfaceProps {
   callId: string;
   isInterviewer: boolean;
   booking: Booking;
   onEndCall: () => void;
   onNavigateOut: () => void;
   apiKey: string;
   token: string;
   currentUser: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
   };
}

const CallInterface = ({
   callId,
   isInterviewer,
   booking,
   onEndCall,
   onNavigateOut,
   apiKey,
   token,
   currentUser,
}: CallInterfaceProps) => {
   const { useCallCallingState } = useCallStateHooks();
   const call = useCall();
   const callingState = useCallCallingState();

   const [activeTab, setActiveTab] = useState<'chat' | 'video'>('video');
   const [chatChannel, setChatChannel] = useState<Channel | null>(null);
   const [chatError, setChatError] = useState<string | null>(null);
   const [isCallEndedByHost, setIsCallEndedByHost] = useState<boolean>(false);

   const currentUserName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() || 'User';

   const chatClient = useCreateChatClient({
      apiKey,
      tokenOrProvider: token,
      userData: {
         id: currentUser.id,
         name: currentUserName,
         image: currentUser.imageUrl || '',
      },
   });

   const intervieweeId = booking.interviewee.clerkUserId;
   const interviewerId = booking.interviewer.clerkUserId;

   useEffect(() => {
      if (!chatClient) return;

      let cancelled = false;
      let channelRef: Channel | null = null;
      const clientAtEffectStart = chatClient;

      const createAndSetupChannel = async () => {
         try {
            const channel = clientAtEffectStart.channel('messaging', callId, {
               name: 'Interview Chat',
               members: [intervieweeId, interviewerId],
            } as ChannelData);

            await channel.watch();

            if (cancelled || clientAtEffectStart !== chatClient) {
               channel.stopWatching().catch(() => { /* no-op */ });
               return;
            }

            channelRef = channel;
            setChatChannel(channel);
            setChatError(null);
         } catch {
            if (!cancelled) {
               setChatError('Chat is currently unavailable.');
            }
         }
      };

      void createAndSetupChannel();

      return () => {
         cancelled = true;
         if (channelRef) {
            channelRef.stopWatching().catch(() => { /* no-op */ });
         }
         setChatChannel(null);
      };
   }, [chatClient, callId, intervieweeId, interviewerId]);

   // Listen for call.ended event emitted when host ends the call
   useEffect(() => {
      if (!call) return;
      const unsubscribe = call.on('call.ended', () => {
         setIsCallEndedByHost(true);
      });
      return () => {
         unsubscribe();
      };
   }, [call]);

   const handleEndCall = useCallback(async () => {
      if (call?.state?.recording) {
         await call.stopRecording().catch(() => { /* no-op */ });
      }
      if (isInterviewer) {
         await handleCompleteCall({ callId }).catch(() => { /* no-op */ });
         await call?.endCall().catch(() => { /* no-op */ });
      } else {
         await call?.leave().catch(() => { /* no-op */ });
      }
      onEndCall();
   }, [call, callId, isInterviewer, onEndCall]);

   // Helper to determine exact card content across all exit scenarios
   const getEndSessionContent = () => {
      if (isInterviewer) {
         return {
            badge: 'Session Completed',
            title: 'Interview Concluded',
            description: 'You have successfully completed this mock interview session. Your session credits have been settled to your account.',
            buttonText: 'Return to Dashboard',
         };
      }

      if (isCallEndedByHost) {
         return {
            badge: 'Interview Concluded',
            title: 'Interview Ended by Host',
            description: 'The interviewer has concluded this mock technical interview. Your recording and AI feedback evaluation will be available on your appointments page.',
            buttonText: 'View Your Appointments',
         };
      }

      return {
         badge: 'Left Session',
         title: 'You Left the Interview',
         description: 'You have left the interview room. You can review your session status, recording, and feedback on your appointments page.',
         buttonText: 'View Your Appointments',
      };
   };

   // Session ended full-screen view (hides header, tabs, and chat sidebar)
   if (isCallEndedByHost || callingState === CallingState.LEFT || callingState === CallingState.IDLE) {
      const { badge, title, description, buttonText } = getEndSessionContent();

      return (
         <div className="flex flex-col items-center justify-center min-h-dvh w-full p-4 sm:p-6 bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
            <CardLayout className='flex flex-col items-center text-center gap-2 max-w-125 w-full'>
               {/* Icon */}
               <div className="flex items-center justify-center size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-inner">
                  <CheckCircle2 className="size-6" />
               </div>

               {/* Badge & Title */}
               <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-2.5 py-0.5 font-normal mb-1">
                  {badge}
               </Badge>

               <SecondaryTitle
                  text={title}
                  className="text-lg! 2xl:text-lg! font-semibold! text-zinc-100!"
               />
               <PrimaryBody
                  text={description}
                  className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! max-w-xs leading-relaxed"
               />

               {/* Action Button */}
               <Button
                  type="button"
                  size="lg"
                  onClick={onNavigateOut}
                  className="mt-4 w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all gap-2 group cursor-pointer"
               >
                  <span>{buttonText}</span>
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
               </Button>
            </CardLayout>
         </div>
      );
   }

   // Initial loading screen before client is initialized or call is joined
   if (!chatClient || callingState === CallingState.JOINING || callingState === CallingState.UNKNOWN) {
      return <ScreenLoader className='min-h-screen h-full' text="Entering live interview room..." />;
   }

   return (
      <div className="flex flex-col h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
         <CallHeader booking={booking} />

         {/* Mobile tab switcher */}
         <div className="lg:hidden">
            <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
         </div>

         {/* Content area */}
         <div className="flex flex-1 min-h-0 relative">
            {/* Video — full width on mobile when active, flex-1 on desktop */}
            <div className={[
               activeTab === 'video' ? 'flex flex-col flex-1 min-w-0' : 'hidden',
               'lg:flex lg:flex-col lg:flex-1 lg:min-w-0',
            ].join(' ')}>
               <VideoPanel onEndCall={() => { void handleEndCall(); }} />
            </div>

            {/* Chat — full width on mobile when active, 32% on desktop */}
            <div className={[
               activeTab === 'chat' ? 'flex flex-col flex-1 min-w-0' : 'hidden',
               'lg:flex lg:flex-col lg:w-[32%] lg:max-w-md lg:flex-none',
            ].join(' ')}>
               {chatError ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center text-zinc-400 bg-zinc-900/50 rounded-2xl border border-white/10 m-2 sm:m-3 lg:m-4 lg:ml-0">
                     <SecondaryTitle
                        text="Chat Unavailable"
                        className="text-xs! 2xl:text-xs! font-medium! text-zinc-200!"
                     />
                     <PrimaryBody
                        text={chatError}
                        className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-400! mt-1"
                     />
                  </div>
               ) : chatChannel ? (
                  <ChatPanel
                     chatClient={chatClient}
                     chatChannel={chatChannel}
                     isInterviewer={isInterviewer}
                     expertise={booking.interviewer.expertise}
                  />
               ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center text-zinc-400 bg-zinc-900/50 rounded-2xl border border-white/10 m-2 sm:m-3 lg:m-4 lg:ml-0">
                     <PrimaryBody
                        text="Connecting to interview chat..."
                        className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400!"
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default CallInterface;