"use client"

import { cn } from "@/lib/utils";
import { HomeIcon, MessageCircleIcon, StarIcon, TagIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
   isOpen: boolean
   onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
   const pathname = usePathname();

   const links = [
      { label: "Home", href: "/", icon: <HomeIcon className="w-5 h-5" /> },
      { label: "Featured", href: "/featured", icon: <StarIcon className="w-5 h-5" /> },
      { label: "Pricing", href: "/pricing", icon: <TagIcon className="w-5 h-5" /> },
      { label: "Contact", href: "/contact", icon: <MessageCircleIcon className="w-5 h-5" /> },
   ]

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
               "fixed left-0 top-0 h-screen w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-white/[0.08] z-50 flex flex-col transform transition-transform duration-300 ease-in-out",
               isOpen ? "translate-x-0" : "-translate-x-full",
               "md:hidden pt-15"
            )}
         >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
               <span className="text-[15px] font-medium text-zinc-50">Navigation</span>
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
               <div className="space-y-1">
                  {links.map(({ label, href, icon }) => {
                     const isActive = pathname === href;
                     return (
                        <Link
                           key={label}
                           href={href}
                           onClick={onClose}
                           className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                              isActive
                                 ? "bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10"
                                 : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                           )}
                        >
                           {icon}
                           {label}
                        </Link>
                     )
                  })}
               </div>
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-white/[0.08]">
               <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                     JD
                  </div>
                  <div className="min-w-0">
                     <p className="text-[13px] font-medium text-zinc-50 truncate">John Doe</p>
                     <p className="text-xs text-zinc-500 truncate">john@acme.com</p>
                  </div>
               </div>
            </div>
         </aside>
      </>
   )
}

export default Sidebar;