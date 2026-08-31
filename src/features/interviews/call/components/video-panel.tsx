'use client';

import { useCallback, useState } from 'react';
import {
   SpeakerLayout,
   StreamTheme,
   useCall,
   useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover';
import CustomTooltip from '@/components/common/custom-tooltip';
import { toast } from 'sonner';
import {
   Mic,
   MicOff,
   Camera,
   CameraOff,
   ScreenShare,
   ScreenShareOff,
   Smile,
   Disc,
   Pause,
   PhoneOff,
} from 'lucide-react';

interface VideoPanelProps {
   onEndCall: () => void;
}

const EMOJI_REACTIONS = [
   { emoji: '👍', name: 'Thumbs Up', code: ':like:' },
   { emoji: '👏', name: 'Clap', code: ':clap:' },
   { emoji: '❤️', name: 'Heart', code: ':heart:' },
   { emoji: '🎉', name: 'Party', code: ':fireworks:' },
   { emoji: '🔥', name: 'Fire', code: ':fire:' },
   { emoji: '🚀', name: 'Rocket', code: ':rocket:' },
   { emoji: '👋', name: 'Wave', code: ':wave:' },
   { emoji: '💡', name: 'Idea', code: ':bulb:' },
];

const CustomCallControls = ({ onLeave }: { onLeave: () => void; }) => {
   const call = useCall();
   const {
      useCameraState,
      useMicrophoneState,
      useScreenShareState,
      useIsCallRecordingInProgress
   } = useCallStateHooks();

   const {
      camera,
      isMute: isCameraMute,
      devices: cameraDevices,
   } = useCameraState();

   const {
      microphone,
      isMute: isMicMute,
      devices: micDevices,
   } = useMicrophoneState();

   const { screenShare, isMute: isScreenShareMute } = useScreenShareState();
   const isCallRecordingInProgress = useIsCallRecordingInProgress();

   const [isReactionOpen, setIsReactionOpen] = useState(false);

   const handleToggleCamera = useCallback(async () => {
      if (!camera) return;
      if (isCameraMute && cameraDevices.length === 0) {
         toast.error('No camera detected on your device');
         return;
      }
      try {
         if (isCameraMute) {
            await camera.enable();
         } else {
            await camera.disable();
         }
      } catch {
         toast.error('Failed to toggle camera');
      }
   }, [camera, isCameraMute, cameraDevices.length]);

   const handleToggleMicrophone = useCallback(async () => {
      if (!microphone) return;
      if (isMicMute && micDevices.length === 0) {
         toast.error('No microphone detected on your device');
         return;
      }
      try {
         if (isMicMute) {
            await microphone.enable();
         } else {
            await microphone.disable();
         }
      } catch {
         toast.error('Failed to toggle microphone');
      }
   }, [microphone, isMicMute, micDevices.length]);

   const handleToggleScreenShare = useCallback(async () => {
      if (!screenShare) return;
      try {
         await screenShare.toggle();
      } catch {
         toast.error('Failed to toggle screen share');
      }
   }, [screenShare]);

   const handleSendReaction = useCallback(async (reaction: typeof EMOJI_REACTIONS[number]) => {
      if (!call) return;
      try {
         await call.sendReaction({
            type: 'reaction',
            emoji_code: reaction.code,
            custom: { emoji: reaction.emoji },
         });
         setIsReactionOpen(false);
      } catch {
         toast.error('Failed to send reaction');
      }
   }, [call]);

   const handleToggleRecording = useCallback(async () => {
      if (!call) return;
      try {
         if (isCallRecordingInProgress) {
            await call.stopRecording();
            toast.success('Call recording stopped');
         } else {
            await call.startRecording();
            toast.success('Call recording started');
         }
      } catch {
         toast.error('Failed to toggle recording');
      }
   }, [call, isCallRecordingInProgress]);

   return (
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 py-1.5 px-3">
         {/* Microphone */}
         <CustomTooltip
            trigger={
               <Button
                  type="button"
                  size="icon"
                  onClick={() => { void handleToggleMicrophone(); }}
                  className={`size-10 sm:size-11 rounded-xl transition-all cursor-pointer ${!isMicMute
                     ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                     : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                     } ${micDevices.length === 0 ? 'opacity-70' : ''}`}
               >
                  {!isMicMute && micDevices.length > 0 ? (
                     <Mic className="size-4 sm:size-5" />
                  ) : (
                     <MicOff className="size-4 sm:size-5" />
                  )}
               </Button>
            }
            content={
               micDevices.length === 0
                  ? 'No microphone detected'
                  : !isMicMute
                     ? 'Mute microphone'
                     : 'Unmute microphone'
            }
         />

         {/* Camera */}
         <CustomTooltip
            trigger={
               <Button
                  type="button"
                  size="icon"
                  onClick={() => { void handleToggleCamera(); }}
                  className={`size-10 sm:size-11 rounded-xl transition-all cursor-pointer ${!isCameraMute
                     ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                     : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                     } ${cameraDevices.length === 0 ? 'opacity-70' : ''}`}
               >
                  {!isCameraMute && cameraDevices.length > 0 ? (
                     <Camera className="size-4 sm:size-5" />
                  ) : (
                     <CameraOff className="size-4 sm:size-5" />
                  )}
               </Button>
            }
            content={
               cameraDevices.length === 0
                  ? 'No camera detected'
                  : !isCameraMute
                     ? 'Turn off camera'
                     : 'Turn on camera'
            }
         />

         {/* Screen share */}
         <CustomTooltip
            trigger={
               <Button
                  type="button"
                  size="icon"
                  onClick={() => { void handleToggleScreenShare(); }}
                  className={`size-10 sm:size-11 rounded-xl transition-all cursor-pointer ${!isScreenShareMute
                     ? 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-400/40 shadow-lg shadow-violet-600/30'
                     : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                     }`}
               >
                  {!isScreenShareMute ? (
                     <ScreenShare className="size-4 sm:size-5" />
                  ) : (
                     <ScreenShareOff className="size-4 sm:size-5 text-zinc-400" />
                  )}
               </Button>
            }
            content={!isScreenShareMute ? 'Stop sharing screen' : 'Share screen'}
         />

         {/* Reactions Popover */}
         <Popover open={isReactionOpen} onOpenChange={setIsReactionOpen}>
            <CustomTooltip
               trigger={
                  <PopoverTrigger asChild>
                     <Button
                        type="button"
                        size="icon"
                        className="size-10 sm:size-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 transition-all cursor-pointer"
                     >
                        <Smile className="size-4 sm:size-5" />
                     </Button>
                  </PopoverTrigger>
               }
               content="Reactions"
            />
            <PopoverContent
               side="top"
               align="center"
               sideOffset={10}
               className="flex-row! flex-nowrap! w-auto! min-w-max! p-1.5 bg-zinc-900/95 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl shadow-violet-950/30 flex items-center gap-1"
            >
               {EMOJI_REACTIONS.map((item) => (
                  <button
                     key={item.code}
                     type="button"
                     onClick={() => { void handleSendReaction(item); }}
                     title={item.name}
                     className="size-8.5 rounded-xl hover:bg-white/10 flex items-center justify-center text-lg transition-transform hover:scale-125 cursor-pointer active:scale-95"
                  >
                     {item.emoji}
                  </button>
               ))}
            </PopoverContent>
         </Popover>

         {/* Recording */}
         <CustomTooltip
            trigger={
               <Button
                  type="button"
                  size="icon"
                  onClick={() => { void handleToggleRecording(); }}
                  className={`size-10 sm:size-11 rounded-xl transition-all cursor-pointer ${isCallRecordingInProgress
                     ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 shadow-lg shadow-red-500/20'
                     : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                     }`}
               >
                  {isCallRecordingInProgress ? (
                     <Pause className="size-4 sm:size-5 text-red-400 fill-current" />
                  ) : (
                     <Disc className="size-4 sm:size-5" />
                  )}
               </Button>
            }
            content={isCallRecordingInProgress ? 'Stop recording' : 'Record session'}
         />

         {/* Leave call */}
         <CustomTooltip
            trigger={
               <Button
                  type="button"
                  size="icon"
                  onClick={onLeave}
                  className="size-10 sm:size-11 rounded-xl bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-600/25 transition-all cursor-pointer ml-1"
               >
                  <PhoneOff className="size-4 sm:size-5" />
               </Button>
            }
            content="Leave interview"
         />
      </div>
   );
};

const VideoPanel = ({ onEndCall }: VideoPanelProps) => {
   return (
      <div className="flex flex-col h-full w-full p-2 sm:p-3 lg:p-4 bg-zinc-950">
         <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl shadow-violet-950/20 flex flex-col min-h-0">
            <StreamTheme className="relative h-full w-full flex-1 flex flex-col items-center justify-center min-h-0">
               <div className="flex-1 w-full h-full min-h-0 flex items-center justify-center relative overflow-hidden">
                  <SpeakerLayout participantsBarPosition="bottom" />
               </div>
               <div className="shrink-0 max-sm:w-full sm:rounded-full px-2 sm:px-4 sm:mb-2 border-t border-white/5 bg-zinc-950/70 backdrop-blur-md">
                  <CustomCallControls onLeave={onEndCall} />
               </div>
            </StreamTheme>
         </div>
      </div>
   );
};

export default VideoPanel;

