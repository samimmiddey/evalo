"use client";

import { navigationData } from "@/data/navigation/navigation.data";
import { cn } from "@/lib/utils";
import { X, BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
   isOpen: boolean;
   onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
   const pathname = usePathname();

   return (
      <>
         {/* Backdrop overlay */}
         {isOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-40 md:hidden"
               onClick={onClose}
            />
         )}

         {/* Sidebar */}
         <aside
            className={cn(
               "fixed left-0 top-0 h-dvh w-full bg-linear-to-b from-zinc-900 to-zinc-950 border-r border-white/8 z-9999 flex flex-col transform transition-transform duration-300 ease-in-out",
               isOpen ? "translate-x-0" : "-translate-x-full",
               "md:hidden"
            )}
         >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
               <Link href='/' className='flex items-center gap-1.5 text-violet-400' onClick={onClose}>
                  <BotMessageSquare className='mt-0.5 h-6.5 w-6.5' />
                  <h4 className='font-musemoderno font-bold text-xl'>evalo</h4>
               </Link>
               <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Close menu"
               >
                  <X className="w-5 h-5 text-zinc-400" />
               </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
               <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest px-2 mb-3">
                  Menu
               </p>
               <div className="space-y-4">
                  {navigationData.map((item) => {
                     const isActive = pathname === item.href;
                     return (
                        <Link
                           key={item.name}
                           href={item.href}
                           onClick={onClose}
                           className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                              isActive
                                 ? "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                                 : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                           )}
                        >
                           {item.icon && <item.icon className="w-5 h-5" />}
                           {item.name}
                        </Link>
                     );
                  })}
               </div>
            </nav>
         </aside>
      </>
   );
};

export default Sidebar;