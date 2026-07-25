import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Sparkles, X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalWrapperProps {
   open: boolean;
   onClose: () => void;
   title: string;
   description: string;
   children: ReactNode;
}

const ModalWrapper = ({ open, onClose, title, description, children }: ModalWrapperProps) => {
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent
            showCloseButton={false}
            className="flex flex-col gap-0 p-0 w-full max-w-6xl max-h-[90vh]
               rounded-2xl border border-white/8 bg-[#0f0f12] shadow-2xl shadow-black/60
               sm:max-w-6xl overflow-hidden z-9999"
         >
            {/* Ambient gradient top */}
            <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-violet-600/12 via-violet-600/4 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-60 rounded-full blur-[100px] bg-violet-500/15 pointer-events-none" />

            {/* Header */}
            <DialogTitle className="relative z-10 shrink-0 flex items-start justify-between gap-4 px-6 pt-6 pb-5 sm:px-7 sm:pt-7 border-b border-white/5">
               <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2.5 mb-1">
                     <div className="flex items-center justify-center w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-violet-500/20 border border-violet-500/30">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                     </div>
                     <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                        {title}
                     </span>
                  </div>
                  <p className="text-sm text-gray-400 font-inter max-w-xl leading-relaxed">
                     {description}
                  </p>
               </div>

               {/* Close button */}
               <button
                  onClick={onClose}
                  className="shrink-0 flex items-center justify-center w-6 2xl:w-7 h-6 2xl:h-7 rounded-lg
                     bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15
                     text-gray-400 hover:text-white transition-all duration-200 mt-0.5 cursor-pointer"
                  aria-label="Close modal"
               >
                  <X className="w-4 h-4" />
               </button>
            </DialogTitle>

            {/* Scrollable body */}
            <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 lg:px-7
               [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.3)_transparent]">
               {children}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ModalWrapper;