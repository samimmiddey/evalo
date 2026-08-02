import { cn } from '@/lib/utils';
import React from 'react';

interface CardLayoutProps {
   children: React.ReactNode;
   className?: string;
}

const CardLayout = ({ children, className }: CardLayoutProps) => {
   return (
      <div className={cn("relative overflow-hidden bg-zinc-900/40 border border-white/5 rounded-2xl p-6 2xl:p-8 transition-all duration-300 hover:bg-zinc-900/80 hover:border-violet-500/30 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]", className)}>
         {children}
      </div>
   );
};

export default CardLayout;