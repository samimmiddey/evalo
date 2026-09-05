import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { ScrollText } from "lucide-react";

export const EmptyCard = () => {
   return (
      <div className="flex flex-col items-center justify-center p-6 text-center my-auto w-full">
         <div className="relative mb-3">
            <div className="relative flex items-center justify-center size-12 rounded-xl bg-zinc-600/10 border border-zinc-500/30 text-zinc-400">
               <ScrollText className="size-5" />
            </div>
         </div>
         <SecondaryTitle
            text="AI Question Generator"
            className="text-sm! 2xl:text-[15px]! font-semibold! text-zinc-200!"
         />
         <PrimaryBody
            text="Select an expertise domain above to generate tailored technical interview questions."
            className="text-xs! lg:text-xs! 2xl:text-[13px]! text-zinc-400! mt-1 max-w-80 leading-relaxed w-full"
         />
      </div>
   );
};