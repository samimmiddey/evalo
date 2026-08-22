'use client';

import { Video, MessageSquare } from 'lucide-react';
import {
   Tabs,
   TabsList,
   TabsTrigger,
} from '@/components/ui/tabs';

interface TabSwitcherProps {
   activeTab: 'chat' | 'video';
   onTabChange: (tab: 'chat' | 'video') => void;
}

const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
   return (
      <div className="shrink-0 bg-zinc-900/60 border-b border-white/10 px-4 py-2.5 backdrop-blur-md">
         <Tabs
            value={activeTab}
            onValueChange={(v) => onTabChange(v as 'chat' | 'video')}
         >
            <TabsList className="w-full bg-zinc-950/70 border border-white/10 h-10 p-1 rounded-xl">
               <TabsTrigger
                  value="video"
                  className="flex-1 gap-2 rounded-lg data-active:bg-violet-600/20 data-active:text-violet-300 data-active:border-violet-500/30 data-active:border text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all"
               >
                  <Video className="size-3.5 shrink-0 text-violet-400" />
                  <span>Live Video</span>
               </TabsTrigger>

               <TabsTrigger
                  value="chat"
                  className="flex-1 gap-2 rounded-lg relative data-active:bg-violet-600/20 data-active:text-violet-300 data-active:border-violet-500/30 data-active:border text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all"
               >
                  <MessageSquare className="size-3.5 shrink-0 text-violet-400" />
                  <span>Interview Chat</span>
               </TabsTrigger>
            </TabsList>
         </Tabs>
      </div>
   );
};

export default TabSwitcher;

