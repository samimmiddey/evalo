"use client";

import { Show, UserButton, useUser } from '@clerk/nextjs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useDbUser } from '@/hooks/use-db-user';

const DashboardNavbar = () => {
   const { isLoaded } = useUser();
   const { user } = useDbUser();

   const roleLabel = user?.role === 'INTERVIEWER' ? 'Interviewer' : 'Interviewee';

   return (
      <header className='sticky top-0 z-30 w-full h-14 border-b border-white/5 bg-zinc-900/40 backdrop-blur-xl transition-all'>
         <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Sidebar trigger & Workspace identifier */}
            <div className="flex items-center gap-3">
               <SidebarTrigger className="cursor-pointer size-8 rounded-lg bg-white/5 text-violet-400 transition-colors" />

               <div className="h-4 w-px bg-white/10 hidden sm:block" />

               <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                     {user?.role ? roleLabel : <div className='h-6 w-20 rounded-md bg-zinc-800 animate-pulse' />}
                  </span>
               </div>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
               {!isLoaded ? (
                  <div className="size-8 rounded-full bg-zinc-800 animate-pulse ring-2 ring-white/5" />
               ) : (
                  <Show when="signed-in">
                     <div className="flex items-center gap-3">
                        <UserButton
                           appearance={{
                              elements: {
                                 avatarBox: "size-8 ring-2 ring-white/10 hover:ring-violet-500/40 transition-all shadow-sm",
                              }
                           }}
                        />
                     </div>
                  </Show>
               )}
            </div>
         </div>
      </header>
   );
};

export default DashboardNavbar;