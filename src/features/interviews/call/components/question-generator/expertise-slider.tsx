import { Badge } from "@/components/ui/badge";
import useEmblaCarousel from "embla-carousel-react";

interface ExpertiseSliderProps {
   expertise: string[];
   selectedExpertise: string;
   handleExpertiseSelection: (expertise: string) => void;
   disabled?: boolean;
}

export const ExpertiseSlider = ({
   expertise,
   selectedExpertise,
   handleExpertiseSelection,
   disabled = false,
}: ExpertiseSliderProps) => {
   const [emblaRef] = useEmblaCarousel({
      dragFree: true,
      containScroll: 'trimSnaps',
   });

   return (
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
         <div className="flex gap-2">
            {expertise.map((item) => {
               const isSelected = selectedExpertise === item;
               return (
                  <Badge
                     key={item}
                     variant={isSelected ? "default" : "outline"}
                     onClick={() => {
                        if (!disabled) {
                           handleExpertiseSelection(item);
                        }
                     }}
                     className={`
                        h-auto shrink-0 px-3 py-1 text-[11px] font-medium transition-all cursor-pointer select-none
                        ${disabled ? 'opacity-70! cursor-not-allowed! pointer-events-none!' : ''}
                        ${isSelected
                           ? 'bg-violet-600 hover:bg-violet-600 border-violet-500 text-white shadow-sm shadow-violet-600/30 font-semibold'
                           : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-white/20'
                        }
                     `}
                  >
                     {item.replace(/_/g, ' ')}
                  </Badge>
               );
            })}
         </div>
      </div>
   );
};