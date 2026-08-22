'use client';

import { useRef, useState } from 'react';
import { Channel as StreamChannel } from 'stream-chat';
import { StreamChat } from 'stream-chat';
import {
   Chat,
   Channel,
   MessageList,
   Window,
} from 'stream-chat-react';
import { MessageSquare, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ChatPanelProps {
   chatClient: StreamChat;
   chatChannel: StreamChannel;
}

const EmptyChatState = () => (
   <div className="flex flex-col items-center justify-center h-full p-6 text-center text-zinc-400">
      <div className="relative mb-3">
         <div className="absolute -inset-1 rounded-2xl bg-violet-600/20 blur-sm" />
         <div className="relative flex items-center justify-center size-12 rounded-2xl bg-zinc-800/90 border border-violet-500/30 text-violet-400 shadow-lg">
            <MessageSquare className="size-5" />
         </div>
      </div>
      <p className="text-xs font-semibold text-zinc-200">No Messages Yet</p>
      <p className="text-[11px] text-zinc-400 mt-1 max-w-55 leading-relaxed">
         Send a message to share links, notes, or questions during your interview.
      </p>
   </div>
);

const CustomChatInput = ({ chatChannel }: { chatChannel: StreamChannel; }) => {
   const [text, setText] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const handleSend = async () => {
      const trimmed = text.trim();
      if (!trimmed || isSubmitting) return;

      setIsSubmitting(true);
      try {
         await chatChannel.sendMessage({ text: trimmed });
         setText('');
         if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
         }
      } catch {
         toast.error('Failed to send message');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         void handleSend();
      }
   };

   const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
   };

   return (
      <div className="p-3 bg-zinc-950/80 border-t border-white/10 backdrop-blur-md shrink-0">
         <form
            onSubmit={(e) => {
               e.preventDefault();
               void handleSend();
            }}
            className="flex items-end gap-2 p-1.5 rounded-xl bg-zinc-900/90 border border-white/10 focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all shadow-inner"
         >
            <Textarea
               ref={textareaRef}
               rows={1}
               value={text}
               onChange={handleInput}
               onKeyDown={handleKeyDown}
               placeholder="Type a message..."
               className="flex-1 bg-transparent text-sm! text-zinc-100 placeholder:text-zinc-500 px-2.5 py-1.5 resize-none outline-none max-h-28 min-h-8 leading-relaxed scrollbar-none"
            />

            <Button
               type="submit"
               size="icon"
               disabled={!text.trim() || isSubmitting}
               className="size-8 rounded-lg bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-sm"
            >
               <Send className="size-3.5" />
            </Button>
         </form>
         <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] text-zinc-500">
            <span>Shift + Enter for new line</span>
            <span className="text-zinc-600">Enter to send</span>
         </div>
      </div>
   );
};

const ChatPanel = ({ chatClient, chatChannel }: ChatPanelProps) => {
   return (
      <div className="flex flex-col h-full w-full p-2 sm:p-3 lg:p-4 lg:pl-0 bg-zinc-950">
         <div className="relative flex-1 rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl shadow-violet-950/20 flex flex-col min-h-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0 bg-zinc-950/70 backdrop-blur-md">
               <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
                     <MessageSquare className="size-4" />
                  </div>
                  <div>
                     <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                        Interview Chat
                     </h3>
                     <p className="text-[10px] text-zinc-400">Live in-call messaging</p>
                  </div>
               </div>

               <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2.5 py-0.5 font-normal flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Active
               </Badge>
            </div>

            {/* Chat Area */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden evalo-chat-container str-chat__theme-dark">
               <Chat client={chatClient}>
                  <Channel
                     channel={chatChannel}
                     initializeOnMount={false}
                     EmptyPlaceholder={<EmptyChatState />}
                  >
                     <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 min-h-0 overflow-hidden">
                           <Window>
                              <MessageList disableDateSeparator={false} />
                           </Window>
                        </div>
                        <CustomChatInput chatChannel={chatChannel} />
                     </div>
                  </Channel>
               </Chat>
            </div>
         </div>
      </div>
   );
};

export default ChatPanel;



