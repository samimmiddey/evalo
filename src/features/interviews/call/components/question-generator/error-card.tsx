import PrimaryBody from "@/components/common/primary-body";
import SecondaryTitle from "@/components/common/secondary-title";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
   error: string;
   onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
   return (
      <div className="flex flex-col items-center justify-center p-6 text-center my-auto gap-3">
         <div className="flex items-center justify-center size-11 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
            <AlertCircle className="size-5" />
         </div>
         <div>
            <SecondaryTitle
               text="Failed to Generate"
               className="text-[15px]! font-semibold! text-zinc-200!"
            />
            <PrimaryBody
               text={error || "An unexpected error occurred while generating questions."}
               className="text-xs! lg:text-xs! text-zinc-400! mt-1.5 max-w-65 wrap-break-word"
            />
         </div>
         <Button
            type="button"
            size="sm"
            onClick={onRetry}
            className="mt-1 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 text-xs font-medium gap-1.5 cursor-pointer"
         >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
         </Button>
      </div>
   );
};