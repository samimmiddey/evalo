'use client';

import { useRef, useState } from 'react';
import { Channel as StreamChannel } from 'stream-chat';
import { StreamChat } from 'stream-chat';
import {
   Chat,
   Channel,
   MessageList,
   Window,
   useMessageContext,
   useChatContext,
   ComponentProvider,
} from 'stream-chat-react';
import { format } from 'date-fns';
import { MessageSquare, Send, Paperclip, X, FileText, Download, Loader2, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SecondaryTitle from '@/components/common/secondary-title';
import PrimaryBody from '@/components/common/primary-body';
import QuestionGenerator from './question-generator/question-generator';

interface ChatPanelProps {
   chatClient: StreamChat;
   chatChannel: StreamChannel;
   isInterviewer?: boolean;
   expertise: string[];
}

const EMOJI_MAP: Record<string, string> = {
   like: '👍',
   love: '❤️',
   haha: '😂',
   clap: '👏',
   rocket: '🚀',
   fire: '🔥',
};

const QUICK_REACTIONS = ['like', 'love', 'haha', 'clap', 'rocket', 'fire'];

const formatFileSize = (size?: unknown): string | null => {
   if (!size) return null;
   const bytes = typeof size === 'number' ? size : Number(size);
   if (isNaN(bytes) || bytes <= 0) return null;
   if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
   }
   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const CustomMessageUI = () => {
   const { message, isMyMessage, handleReaction } = useMessageContext();
   const { client, channel } = useChatContext();
   const isMe = Boolean(
      (client?.userID && message.user?.id === client.userID) ||
      (typeof isMyMessage === 'function' && isMyMessage())
   );

   const userName = message.user?.name || (isMe ? 'You' : 'Participant');
   const timeString = message.created_at
      ? format(new Date(message.created_at), 'h:mm a')
      : '';

   const handleToggleReaction = async (
      e: React.MouseEvent,
      reactionType: string
   ) => {
      e.preventDefault();
      e.stopPropagation();

      try {
         if (handleReaction) {
            await handleReaction(reactionType, e);
         } else if (channel && message?.id) {
            const hasReacted = message.own_reactions?.some((r) => r.type === reactionType);
            if (hasReacted) {
               await channel.deleteReaction(message.id, reactionType);
            } else {
               await channel.sendReaction(message.id, { type: reactionType });
            }
         }
      } catch {
         toast.error('Failed to update reaction');
      }
   };

   return (
      <div className={`w-full flex ${isMe ? 'justify-end' : 'justify-start'} my-2 px-1`}>
         <div className={`group relative flex flex-col max-w-[85%] sm:max-w-[78%] ${isMe ? 'items-end' : 'items-start'}`}>
            {!isMe && (
               <span className="text-[11px] font-semibold text-zinc-400 px-1 mb-1 tracking-tight">
                  {userName}
               </span>
            )}

            {/* Quick Reaction Bar on Hover */}
            <div
               className={`absolute -top-4 ${isMe ? 'right-0' : 'left-0'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-0.5 bg-zinc-900/95 border border-white/10 p-0.5 rounded-full shadow-lg backdrop-blur-md z-30`}
            >
               {QUICK_REACTIONS.map((type) => {
                  const isSelected = message.own_reactions?.some((r) => r.type === type);
                  return (
                     <button
                        key={type}
                        type="button"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => void handleToggleReaction(e, type)}
                        className={`size-6 flex items-center justify-center rounded-full text-xs hover:scale-125 transition-transform cursor-pointer ${isSelected ? 'bg-violet-600/40 ring-1 ring-violet-500/50' : 'hover:bg-zinc-800'
                           }`}
                        title={type}
                     >
                        {EMOJI_MAP[type]}
                     </button>
                  );
               })}
            </div>

            {/* Bubble */}
            <div
               className={`px-3.5 py-2 text-[13px] leading-relaxed wrap-break-word transition-all ${isMe
                  ? 'bg-violet-600 text-white rounded-2xl rounded-tr-xs shadow-sm'
                  : 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-xs border border-white/10 shadow-sm'
                  }`}
            >
               {message.text && (
                  <PrimaryBody
                     text={message.text}
                     className="whitespace-pre-wrap select-text text-[13px]! lg:text-[13px]! 2xl:text-[13px]! text-inherit!"
                  />
               )}

               {/* Attachments rendering */}
               {message.attachments && message.attachments.length > 0 && (
                  <div className={`flex flex-col gap-2 ${message.text ? 'mt-2' : ''}`}>
                     {message.attachments.map((att, idx) => {
                        const isImg = att.type === 'image' || Boolean(att.image_url);
                        const fileUrl = att.image_url || att.asset_url;

                        if (isImg && fileUrl) {
                           return (
                              <a
                                 key={idx}
                                 href={fileUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block overflow-hidden rounded-xl border border-white/10 hover:opacity-90 transition-opacity"
                              >
                                 <img
                                    src={fileUrl}
                                    alt={att.fallback || att.title || 'Attachment'}
                                    className="max-h-56 w-auto max-w-full rounded-xl object-cover"
                                 />
                              </a>
                           );
                        }

                        return (
                           <a
                              key={idx}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={att.title || 'attachment'}
                              className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors ${isMe
                                 ? 'bg-violet-700/60 border-violet-400/20 hover:bg-violet-700/80 text-white'
                                 : 'bg-zinc-900/90 border-white/10 hover:bg-zinc-900 text-zinc-200'
                                 }`}
                           >
                              <div className="flex items-center justify-center size-7 rounded-lg bg-white/10 shrink-0">
                                 <FileText className="size-3.5 text-violet-300" />
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                 <span className="text-xs font-medium truncate">{att.title || 'Attachment'}</span>
                                 {formatFileSize(att.file_size) && (
                                    <span className="text-[10px] opacity-70">
                                       {formatFileSize(att.file_size)}
                                    </span>
                                 )}
                              </div>
                              <Download className="size-3.5 shrink-0 opacity-70" />
                           </a>
                        );
                     })}
                  </div>
               )}
            </div>

            {/* Reaction Badges */}
            {message.reaction_counts && Object.keys(message.reaction_counts).length > 0 && (
               <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {Object.entries(message.reaction_counts)
                     .filter(([_, count]) => count > 0)
                     .map(([type, count]) => {
                        const isSelected = message.own_reactions?.some((r) => r.type === type);
                        return (
                           <button
                              key={type}
                              type="button"
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={(e) => void handleToggleReaction(e, type)}
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${isSelected
                                 ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                                 : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                 }`}
                           >
                              <span>{EMOJI_MAP[type] || type}</span>
                              <span className="text-[10px]">{count}</span>
                           </button>
                        );
                     })}
               </div>
            )}

            {/* Timestamp */}
            {timeString && (
               <span className={`text-[10px] text-zinc-500 mt-1 px-1 font-normal ${isMe ? 'text-right' : 'text-left'}`}>
                  {timeString}
               </span>
            )}
         </div>
      </div>
   );
};

const EmptyChatState = () => (
   <div className="flex flex-col items-center justify-center h-full p-6 text-center text-zinc-400">
      <div className="relative mb-4">
         <div className="relative flex items-center justify-center size-12 rounded-xl bg-zinc-800/90 border border-zinc-500/30 text-zinc-400">
            <MessageSquare className="size-5" />
         </div>
      </div>
      <SecondaryTitle
         text="No Messages Yet"
         className="text-sm! 2xl:text-sm! font-semibold! text-zinc-200!"
      />
      <PrimaryBody
         text="Send a message to share links, notes, or questions during your interview."
         className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-400! mt-2 max-w-55 leading-relaxed"
      />
   </div>
);

const CustomChatInput = ({ chatChannel }: { chatChannel: StreamChannel; }) => {
   const [text, setText] = useState('');
   const [attachedFile, setAttachedFile] = useState<File | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const handleSend = async () => {
      const trimmed = text.trim();
      if ((!trimmed && !attachedFile) || isSubmitting) return;

      setIsSubmitting(true);
      try {
         let attachments: Record<string, unknown>[] | undefined;

         if (attachedFile) {
            const isImg = attachedFile.type.startsWith('image/');
            if (isImg) {
               const res = await chatChannel.sendImage(attachedFile);
               attachments = [
                  {
                     type: 'image',
                     image_url: res.file,
                     fallback: attachedFile.name,
                  },
               ];
            } else {
               const res = await chatChannel.sendFile(attachedFile);
               attachments = [
                  {
                     type: 'file',
                     asset_url: res.file,
                     title: attachedFile.name,
                     file_size: attachedFile.size,
                     mime_type: attachedFile.type,
                  },
               ];
            }
         }

         await chatChannel.sendMessage({
            text: trimmed || undefined,
            attachments,
         });

         setText('');
         setAttachedFile(null);
      } catch {
         toast.error('Failed to send message');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="p-3 bg-zinc-950/80 border-t border-white/10 backdrop-blur-md shrink-0">
         {/* Attachment Preview Chip */}
         {attachedFile && (
            <div className="flex items-center gap-2 mb-2 p-1.5 px-3 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 w-fit">
               <FileText className="size-3.5 text-violet-400" />
               <span className="truncate max-w-44 font-medium">{attachedFile.name}</span>
               <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-0.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
               >
                  <X className="size-3" />
               </button>
            </div>
         )}

         <form
            onSubmit={(e) => {
               e.preventDefault();
               void handleSend();
            }}
            className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/80 border border-white/10 focus-within:border-violet-500/40 focus-within:ring-1 focus-within:ring-violet-500/20 focus-within:bg-zinc-900 transition-all duration-200"
         >
            {/* Attachment Trigger */}
            <input
               ref={fileInputRef}
               type="file"
               className="hidden"
               onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAttachedFile(file);
                  e.target.value = '';
               }}
            />
            <button
               type="button"
               onClick={() => fileInputRef.current?.click()}
               disabled={isSubmitting}
               className="size-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
               title="Attach file"
            >
               <Paperclip className="size-4" />
            </button>

            <input
               type="text"
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder={attachedFile ? 'Add a message or press send...' : 'Type a message...'}
               disabled={isSubmitting}
               style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
               className="flex-1 bg-transparent border-0 text-sm! text-zinc-100 placeholder:text-zinc-500 min-w-0 px-2 h-9 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 outline-none! shadow-none! border-none! ring-0!"
            />

            <Button
               type="submit"
               size="icon"
               disabled={(!text.trim() && !attachedFile) || isSubmitting}
               className="size-9 rounded-lg bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
               {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
               ) : (
                  <Send className="size-3.5" />
               )}
            </Button>
         </form>
         <div className="flex items-center justify-end px-1 mt-1 text-[10px] text-zinc-500">
            <span className="text-zinc-500">Press Enter to send</span>
         </div>
      </div>
   );
};

const ChatPanel = ({ chatClient, chatChannel, isInterviewer = false, expertise }: ChatPanelProps) => {
   const [activeTab, setActiveTab] = useState<'chat' | 'ai-questions'>('chat');

   return (
      <div className="flex flex-col h-full w-full p-2 sm:p-3 lg:p-4 lg:pl-0 bg-zinc-950">
         <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl shadow-violet-950/20 flex flex-col min-h-0">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-zinc-950/70 backdrop-blur-md">
               {isInterviewer ? (
                  <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-white/10 rounded-xl">
                     <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${activeTab === 'chat'
                           ? 'bg-violet-500/10 border-violet-500/25 text-violet-300 shadow-sm'
                           : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-transparent'
                           }`}
                     >
                        <MessageSquare className="size-3.5" />
                        <span>Chat</span>
                     </button>
                     <button
                        type="button"
                        onClick={() => setActiveTab('ai-questions')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${activeTab === 'ai-questions'
                           ? 'bg-violet-500/10 border-violet-500/25 text-violet-300 shadow-sm'
                           : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-transparent'
                           }`}
                     >
                        <ScrollText className="size-3.5" />
                        <span>AI Questions</span>
                     </button>
                  </div>
               ) : (
                  <div className="flex items-center gap-2.5">
                     <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500/10 border-violet-500/25 text-violet-400 border">
                        <MessageSquare className="size-4" />
                     </div>
                     <div>
                        <SecondaryTitle
                           text="Interview Chat"
                           className="text-xs! 2xl:text-xs! font-semibold! text-zinc-100! flex items-center gap-1.5"
                        />
                        <PrimaryBody
                           text="Live in-call messaging"
                           className="text-[10px]! lg:text-[10px]! 2xl:text-[10px]! text-zinc-400!"
                        />
                     </div>
                  </div>
               )}
            </div>

            {/* Content Area */}
            <div className={`flex-1 min-h-0 flex-col overflow-hidden evalo-chat-container str-chat__theme-dark ${activeTab === 'chat' ? 'flex' : 'hidden'}`}>
               <Chat client={chatClient}>
                  <Channel
                     channel={chatChannel}
                     initializeOnMount={false}
                     EmptyPlaceholder={<EmptyChatState />}
                  >
                     <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 min-h-0 overflow-hidden">
                           <Window>
                              <ComponentProvider value={{ MessageUI: CustomMessageUI, EmptyStateIndicator: EmptyChatState }}>
                                 <MessageList disableDateSeparator={false} />
                              </ComponentProvider>
                           </Window>
                        </div>
                        <CustomChatInput chatChannel={chatChannel} />
                     </div>
                  </Channel>
               </Chat>
            </div>

            {isInterviewer && (
               <div className={`flex-1 min-h-0 flex-col overflow-hidden ${activeTab === 'ai-questions' ? 'flex' : 'hidden'}`}>
                  <QuestionGenerator expertise={expertise} />
               </div>
            )}
         </div>
      </div>
   );
};

export default ChatPanel;



