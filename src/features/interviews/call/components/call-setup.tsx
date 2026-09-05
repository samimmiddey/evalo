'use client';

import { useCallback, useState } from 'react';
import { format } from 'date-fns';
import {
   Camera,
   CameraOff,
   Mic,
   MicOff,
   Volume2,
   Play,
   Video,
   ArrowRight,
   Info,
   CheckCircle2,
   AlertCircle,
   Clock,
   Loader2,
} from 'lucide-react';
import {
   useCallStateHooks,
   VideoPreview,
} from '@stream-io/video-react-sdk';
import { Booking } from '@/features/interviews/call/types/call.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { TooltipProvider } from '@/components/ui/tooltip';
import CustomTooltip from '@/components/common/custom-tooltip';
import { toast } from 'sonner';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';

interface CallSetupProps {
   booking: Booking;
   isInterviewer: boolean;
   currentUser: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
   };
   onJoin: () => Promise<void>;
   onCancel: () => void;
}

const getInitials = (name: string) =>
   name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

export const CallSetup = ({
   booking,
   isInterviewer,
   currentUser,
   onJoin,
   onCancel,
}: CallSetupProps) => {
   const {
      useCameraState,
      useMicrophoneState,
      useSpeakerState,
      useParticipants,
   } = useCallStateHooks();

   const participants = useParticipants();
   const [hasJoinedBefore] = useState(() => {
      if (typeof window !== 'undefined') {
         return sessionStorage.getItem(`evalo_joined_${booking.id}`) === 'true';
      }
      return false;
   });

   const isRejoining = hasJoinedBefore || participants.length > 0;

   const {
      camera,
      isMute: isCameraMute,
      devices: cameraDevices,
      selectedDevice: selectedCamera,
      hasBrowserPermission: hasCameraPermission
   } = useCameraState();

   const {
      microphone,
      isMute: isMicMute,
      devices: micDevices,
      selectedDevice: selectedMic,
      hasBrowserPermission: hasMicPermission
   } = useMicrophoneState();

   const {
      speaker,
      devices: speakerDevices,
      selectedDevice: selectedSpeaker,
      isDeviceSelectionSupported: isSpeakerSelectionSupported
   } = useSpeakerState();

   const [isJoining, setIsJoining] = useState(false);
   const [joinError, setJoinError] = useState<string | null>(null);
   const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

   const currentUserName = `${currentUser.firstName ?? ''} ${currentUser.lastName ?? ''}`.trim() || 'You';
   const counterParty = isInterviewer ? booking.interviewee : booking.interviewer;
   const counterPartyName = `${counterParty.firstName ?? ''} ${counterParty.lastName ?? ''}`.trim();
   const counterPartyRole = isInterviewer ? 'Candidate' : 'Interviewer';

   const scheduledStart = format(new Date(booking.startTime), 'h:mm a');
   const scheduledEnd = format(new Date(booking.endTime), 'h:mm a');
   const scheduledDate = format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy');

   // Toggle camera
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

   // Toggle microphone
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

   // Test speaker sound chime
   const handlePlayTestSound = useCallback(() => {
      try {
         setIsPlayingTestSound(true);
         const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext; }).webkitAudioContext;
         const ctx = new AudioContextClass();

         const playTone = (freq: number, startTime: number, duration: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
         };

         const now = ctx.currentTime;
         playTone(523.25, now, 0.25);
         playTone(659.25, now + 0.15, 0.25);
         playTone(783.99, now + 0.3, 0.4);

         setTimeout(() => {
            setIsPlayingTestSound(false);
            ctx.close().catch(() => { /* no-op */ });
         }, 800);
      } catch {
         setIsPlayingTestSound(false);
         toast.error('AudioContext failed');
      }
   }, []);

   // Select camera
   const handleSelectCamera = useCallback(async (deviceId: string) => {
      if (!camera || cameraDevices.length === 0) return;
      try {
         await camera.select(deviceId);
         if (isCameraMute) {
            await camera.enable();
         }
      } catch {
         toast.error('Failed to select camera');
      }
   }, [camera, isCameraMute, cameraDevices.length]);

   // Select microphone
   const handleSelectMicrophone = useCallback(async (deviceId: string) => {
      if (!microphone || micDevices.length === 0) return;
      try {
         await microphone.select(deviceId);
         if (isMicMute) {
            await microphone.enable();
         }
      } catch {
         toast.error('Failed to select microphone');
      }
   }, [microphone, isMicMute, micDevices.length]);

   // Select speaker
   const handleSelectSpeaker = useCallback((deviceId: string) => {
      if (!speaker) return;
      try {
         speaker.select(deviceId);
      } catch {
         toast.error('Failed to select speaker');
      }
   }, [speaker]);

   // Join call
   const handleJoin = async () => {
      setJoinError(null);
      setIsJoining(true);
      try {
         if (typeof window !== 'undefined') {
            sessionStorage.setItem(`evalo_joined_${booking.id}`, 'true');
         }
         await onJoin();
      } catch {
         setJoinError('Could not join the interview. Please check your network connection.');
         setIsJoining(false);
      }
   };

   return (
      <TooltipProvider>
         <div className="flex flex-col min-h-dvh bg-zinc-950 text-zinc-100 overflow-y-auto selection:bg-violet-500/30">
            {/* Top header bar */}
            <header className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/60 backdrop-blur-md shrink-0">
               <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-lg bg-violet-500/10 border border-violet-500/25 text-violet-300 shrink-0">
                     <Video className="size-5" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <SecondaryTitle
                           text="Pre-Call Device Setup"
                           className="text-sm! 2xl:text-sm! font-semibold! text-zinc-100!"
                        />
                        {
                           isRejoining &&
                           <Badge
                              variant="outline"
                              className="bg-violet-500/10 text-violet-300 border-violet-500/25 text-[11px] font-normal p-2"
                           >
                              Rejoining
                           </Badge>
                        }
                     </div>
                     <PrimaryBody
                        text="Adjust your microphone and camera before entering the room"
                        className="text-xs! lg:text-xs! 2xl:text-xs! mt-0.5! text-zinc-400!"
                     />
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onCancel}
                     className="text-zinc-400 hover:text-zinc-100 text-xs"
                  >
                     Exit
                  </Button>
               </div>
            </header>

            {/* Main content grid */}
            <main className="flex-1 flex items-center justify-center p-4 lg:py-6 2xl:py-8">
               <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 2xl:gap-8 items-start">

                  {/* Left Column: Video Preview & Quick Controls (7 cols on lg) */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                     <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl shadow-violet-950/20 flex items-center justify-center group min-h-90 md:min-h-100">

                        {/* Live video or Avatar fallback */}
                        {!isCameraMute ? (
                           <div className="w-full h-full relative">
                              <VideoPreview className="w-full! h-full!" />
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                              <div className="relative mb-4">
                                 <Avatar className="size-24 border-2 border-white/20 relative shadow-xl">
                                    <AvatarImage src={currentUser.imageUrl ?? undefined} alt={currentUserName} />
                                    <AvatarFallback className="bg-zinc-800 text-violet-300 text-2xl font-medium">
                                       {getInitials(currentUserName)}
                                    </AvatarFallback>
                                 </Avatar>
                              </div>
                              <PrimaryBody
                                 text={currentUserName}
                                 className="text-sm! lg:text-sm! 2xl:text-sm! font-medium! text-zinc-200!"
                              />
                              <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-white/10 text-xs text-zinc-400">
                                 <CameraOff className="size-3.5 text-zinc-500" />
                                 <span>Camera is turned off</span>
                              </div>
                           </div>
                        )}

                        {/* Top-left name badge */}
                        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-200 shadow-sm">
                           <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                           <span className="truncate max-w-35">{currentUserName}</span>
                           <span className="text-[10px] text-zinc-400">(You)</span>
                        </div>

                        {/* Top-right mic status indicator */}
                        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-white/10 text-xs shadow-sm">
                           {!isMicMute ? (
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                 <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                 <Mic className="size-3.5" />
                                 <span className="text-[11px] font-medium text-zinc-300">Mic On</span>
                              </div>
                           ) : (
                              <div className="flex items-center gap-1.5 text-red-400">
                                 <MicOff className="size-3.5" />
                                 <span className="text-[11px] font-medium text-zinc-300">Muted</span>
                              </div>
                           )}
                        </div>

                        {/* Floating bottom toolbar */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-white/15 shadow-2xl">
                           <CustomTooltip
                              trigger={
                                 <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => { void handleToggleMicrophone(); }}
                                    className={`size-11 rounded-xl transition-all ${!isMicMute
                                       ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                                       : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                       } ${micDevices.length === 0 ? 'opacity-70' : ''}`}
                                 >
                                    {!isMicMute && micDevices.length > 0 ? <Mic className="size-5" /> : <MicOff className="size-5" />}
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

                           <CustomTooltip
                              trigger={
                                 <Button
                                    type="button"
                                    size="icon"
                                    onClick={() => { void handleToggleCamera(); }}
                                    className={`size-11 rounded-xl transition-all ${!isCameraMute
                                       ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10'
                                       : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                                       } ${cameraDevices.length === 0 ? 'opacity-70' : ''}`}
                                 >
                                    {!isCameraMute && cameraDevices.length > 0 ? <Camera className="size-5" /> : <CameraOff className="size-5" />}
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
                        </div>
                     </div>

                     {/* Reassurance tips under the preview */}
                     <div className="hidden sm:flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/40 border border-white/5 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                           <Info className="size-4 text-zinc-400 shrink-0" />
                           <span>Tip: Position yourself in good lighting facing your camera</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                           <CheckCircle2 className="size-3.5 text-emerald-500" />
                           <span>Secure connection</span>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Device Selectors & Meeting Card (5 cols on lg) */}
                  <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-5">

                     {/* Interview Summary Card */}
                     <div className="p-5 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-md flex flex-col gap-3.5 shadow-xl">
                        <div className="flex items-start justify-between gap-3">
                           <div className="min-w-0">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-300">
                                 Technical Mock Interview
                              </span>
                           </div>
                           <Badge
                              variant="outline"
                              className="bg-zinc-500/10 border-zinc-500/30 text-zinc-300 text-xs shrink-0 p-2"
                           >
                              {isInterviewer ? 'Interviewer' : 'Interviewee'}
                           </Badge>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-white/5">
                           <Avatar className="size-10 border border-white/10 shrink-0">
                              <AvatarImage src={counterParty.imageUrl ?? undefined} alt={counterPartyName} />
                              <AvatarFallback className="bg-zinc-800 text-violet-300 text-xs font-semibold">
                                 {getInitials(counterPartyName)}
                              </AvatarFallback>
                           </Avatar>
                           <div className="min-w-0 flex-1">
                              <PrimaryBody
                                 text="Meeting with"
                                 className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! leading-none!"
                              />
                              <PrimaryBody
                                 text={counterPartyName}
                                 className="text-sm! lg:text-sm! 2xl:text-sm! font-medium! text-zinc-100! truncate mt-1"
                              />
                              <PrimaryBody
                                 text={counterPartyRole}
                                 className="text-[11px]! lg:text-[11px]! 2xl:text-[11px]! text-zinc-400! leading-none! mt-0.5"
                              />
                           </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                           <Clock className="size-3.5 text-zinc-500 shrink-0" />
                           <span>{scheduledDate} &bull; {scheduledStart} – {scheduledEnd}</span>
                        </div>
                     </div>

                     {/* Hardware Settings Card */}
                     <div className="p-5 rounded-2xl bg-zinc-900/70 border border-white/10 backdrop-blur-md flex flex-col gap-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                           <div className="flex items-center gap-2">
                              <Camera className="size-4 text-zinc-400" />
                              <SecondaryTitle
                                 text="Device Settings"
                                 className="text-xs! 2xl:text-xs! font-semibold! uppercase tracking-wider text-zinc-300!"
                              />
                           </div>
                           <span className="text-[11px] text-zinc-500">Auto-detected</span>
                        </div>

                        {/* Camera Selector */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                 <Camera className="size-3.5 text-zinc-400" />
                                 Camera
                              </span>
                              {!hasCameraPermission && (
                                 <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                    <AlertCircle className="size-3" /> Permission required
                                 </span>
                              )}
                           </label>
                           <Select
                              value={selectedCamera || ''}
                              onValueChange={(val) => { void handleSelectCamera(val); }}
                              disabled={cameraDevices.length === 0}
                           >
                              <SelectTrigger className="w-full bg-zinc-950/80 border-white/10 text-zinc-200 text-xs h-10">
                                 <SelectValue placeholder={cameraDevices.length ? 'Select camera' : 'No camera detected'} />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200 text-xs">
                                 {cameraDevices.map((dev) => (
                                    <SelectItem
                                       key={dev.deviceId}
                                       value={dev.deviceId}
                                       className="text-xs"
                                    >
                                       {dev.label || `Camera (${dev.deviceId.slice(0, 5)})`}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>

                        {/* Microphone Selector */}
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                 <Mic className="size-3.5 text-zinc-400" />
                                 Microphone
                              </span>
                              {!hasMicPermission && (
                                 <span className="text-[10px] text-amber-400 flex items-center gap-1">
                                    <AlertCircle className="size-3" /> Permission required
                                 </span>
                              )}
                           </label>
                           <Select
                              value={selectedMic || ''}
                              onValueChange={(val) => { void handleSelectMicrophone(val); }}
                              disabled={micDevices.length === 0}
                           >
                              <SelectTrigger className="w-full bg-zinc-950/80 border-white/10 text-zinc-200 text-xs h-10">
                                 <SelectValue placeholder={micDevices.length ? 'Select microphone' : 'No microphone detected'} />
                              </SelectTrigger>
                              <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200 text-xs">
                                 {micDevices.map((dev) => (
                                    <SelectItem
                                       key={dev.deviceId}
                                       value={dev.deviceId}
                                       className="text-xs"
                                    >
                                       {dev.label || `Microphone (${dev.deviceId.slice(0, 5)})`}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>

                        {/* Speaker / Output Selector */}
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                                 <Volume2 className="size-3.5 text-zinc-400" />
                                 Speaker / Audio Output
                              </label>
                              <Button
                                 type="button"
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => { void handlePlayTestSound(); }}
                                 disabled={isPlayingTestSound}
                                 className="h-6 px-2 text-[11px] text-violet-300! hover:bg-violet-500/10 gap-1"
                              >
                                 <Play className={`size-3 ${isPlayingTestSound ? 'animate-spin' : ''}`} />
                                 <span>{isPlayingTestSound ? 'Playing...' : 'Test Sound'}</span>
                              </Button>
                           </div>

                           {isSpeakerSelectionSupported && speakerDevices.length > 0 ? (
                              <Select
                                 value={selectedSpeaker || ''}
                                 onValueChange={(val) => { void handleSelectSpeaker(val); }}
                              >
                                 <SelectTrigger className="w-full bg-zinc-950/80 border-white/10 text-zinc-200 text-xs h-10">
                                    <SelectValue placeholder="Select speaker" />
                                 </SelectTrigger>
                                 <SelectContent className="bg-zinc-900 border-white/10 text-zinc-200 text-xs">
                                    {speakerDevices.map((dev) => (
                                       <SelectItem key={dev.deviceId} value={dev.deviceId} className="text-xs">
                                          {dev.label || `Speaker (${dev.deviceId.slice(0, 5)})`}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           ) : (
                              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-950/50 border border-white/5 text-xs text-zinc-400">
                                 <span>Default System Audio Output</span>
                                 <CheckCircle2 className="size-3.5 text-emerald-500" />
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Error prompt if join failed */}
                     {joinError && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                           <AlertCircle className="size-4 shrink-0" />
                           <span>{joinError}</span>
                        </div>
                     )}

                     {/* Action Buttons */}
                     <div className="flex flex-col gap-2.5">
                        <Button
                           type="button"
                           size="lg"
                           onClick={() => { void handleJoin(); }}
                           disabled={isJoining}
                           className="w-full h-11 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm shadow-lg shadow-violet-600/25 transition-all gap-2 group"
                        >
                           {isJoining ? (
                              <>
                                 <Loader2 className="size-4 animate-spin" />
                                 <span>Entering Room...</span>
                              </>
                           ) : (
                              <>
                                 <span>{isRejoining ? 'Rejoin Interview' : 'Join Interview Now'}</span>
                                 <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                              </>
                           )}
                        </Button>

                        <Button
                           type="button"
                           variant="outline"
                           size="lg"
                           onClick={onCancel}
                           disabled={isJoining}
                           className="w-full h-11 rounded-lg bg-zinc-900/60 border-white/10 text-zinc-300 hover:text-zinc-100 hover:bg-white/5 text-sm transition-colors"
                        >
                           Cancel & Return
                        </Button>
                     </div>
                  </div>

               </div>
            </main>
         </div>
      </TooltipProvider>
   );
};

export default CallSetup;
