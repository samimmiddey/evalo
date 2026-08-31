import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Sparkles, X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalWrapperProps {
   open: boolean;
   onClose: () => void;
   title: string;
   description: string;
   children: ReactNode;
   headerIcon?: React.ReactNode;
}

const ModalWrapper = ({ open, onClose, title, description, children, headerIcon }: ModalWrapperProps) => {
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent
            showCloseButton={false}
            className="flex flex-col gap-0 p-0 w-[calc(100%-2rem)] max-w-6xl max-h-[90vh]
               rounded-2xl border border-white/8 bg-[#0f0f12] shadow-2xl shadow-black/60
               sm:max-w-6xl overflow-hidden z-9999"
         >
            {/* Header */}
            <DialogTitle className="relative z-10 shrink-0 flex items-start justify-between gap-4 px-6 pt-6 pb-5 sm:px-7 sm:pt-7 border-b border-white/5">
               <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5 mb-1">
                     <div className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-violet-500/20 border border-violet-500/30">
                        {
                           headerIcon ? headerIcon : <Sparkles className="w-4 h-4 text-violet-400" />
                        }
                     </div>
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-100">
                        {title}
                     </span>
                  </div>
                  <p className="text-xs 2xl:text-sm text-zinc-400 font-inter max-w-xl leading-relaxed">
                     {description}
                  </p>
               </div>

               {/* Close button */}
               <button
                  onClick={onClose}
                  className="shrink-0 flex items-center justify-center w-6 2xl:w-7 h-6 2xl:h-7 rounded-lg
                     bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15
                     text-zinc-400 hover:text-zinc-100 transition-all duration-200 mt-0.5 cursor-pointer"
                  aria-label="Close modal"
               >
                  <X className="w-4 h-4" />
               </button>
            </DialogTitle>

            {/* Scrollable body */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 lg:px-7
               [scrollbar-width:thin] [scrollbar-color:rgba(113,113,122,0.3)_transparent]">
               {children}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ModalWrapper;