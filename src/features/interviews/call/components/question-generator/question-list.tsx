import { Button } from "@/components/ui/button";
import { GeneratedQuestion } from "../../types/call.types";
import { Check, CheckCircle2, Copy, HelpCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SecondaryTitle from "@/components/common/secondary-title";
import { Badge } from "@/components/ui/badge";
import PrimaryBody from "@/components/common/primary-body";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface QuestionsListProps {
   questions: GeneratedQuestion[];
   expertise: string;
   onRegenerate: () => void;
   isPending: boolean;
}

export const QuestionsList = ({ questions, expertise, onRegenerate, isPending }: QuestionsListProps) => {
   return (
      <div className="flex flex-col gap-2.5 pb-2">
         <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-zinc-400">
               3 Questions for <span className="text-zinc-200">{expertise.replace(/_/g, ' ')}</span>
            </span>
            <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={onRegenerate}
               disabled={isPending}
               className="h-7 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 gap-1 cursor-pointer"
            >
               <RotateCcw className="size-3" />
               <span>Regenerate</span>
            </Button>
         </div>

         <div className="flex flex-col gap-2.5">
            {questions.map((q, idx) => (
               <QuestionCard key={q.id || idx} question={q} index={idx + 1} />
            ))}
         </div>
      </div>
   );
};

const DIFFICULTY_STYLES = {
   EASY: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
   MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
   HARD: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
} as const;

interface QuestionCardProps {
   question: GeneratedQuestion;
   index: number;
}

const QuestionCard = ({ question, index }: QuestionCardProps) => {
   const [isCopied, setIsCopied] = useState(false);

   const handleCopy = async () => {
      try {
         await navigator.clipboard.writeText(question.question);
         setIsCopied(true);
         toast.success('Question copied to clipboard');
         setTimeout(() => setIsCopied(false), 2000);
      } catch {
         toast.error('Failed to copy question');
      }
   };

   const difficultyClass =
      DIFFICULTY_STYLES[question.difficulty] ||
      DIFFICULTY_STYLES.MEDIUM;

   return (
      <div className="flex flex-col rounded-xl bg-zinc-900/90 border border-white/10 p-3.5 shadow-sm hover:border-white/15 transition-all">
         {/* Card Top Row */}
         <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
               <span className="flex items-center justify-center size-5 rounded-md bg-violet-600/20 text-violet-300 text-[11px] font-mono font-bold shrink-0">
                  {index}
               </span>
               <SecondaryTitle
                  text={question.title}
                  className="text-[13px]! 2xl:text-[13px]! font-semibold! text-zinc-200! truncate"
               />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
               <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 font-medium tracking-wide uppercase ${difficultyClass}`}
               >
                  {question.difficulty}
               </Badge>

               <button
                  type="button"
                  onClick={() => { void handleCopy(); }}
                  className="size-6 flex items-center justify-center rounded-md hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Copy question text"
               >
                  {isCopied ? (
                     <Check className="size-3 text-emerald-400" />
                  ) : (
                     <Copy className="size-3" />
                  )}
               </button>
            </div>
         </div>

         {/* Question Text */}
         <PrimaryBody
            text={question.question}
            className="text-[13px]! 2xl:text-[13px]! text-zinc-300! leading-relaxed select-text"
         />

         {/* Evaluation Accordion using shadcn/ui */}
         <Accordion type="single" collapsible className="w-full mt-2">
            <AccordionItem value="evaluation" className="border-none not-last:border-none">
               <AccordionTrigger className="py-1 text-xs font-medium text-violet-400 hover:text-violet-300 hover:no-underline cursor-pointer">
                  <span className="flex items-center gap-1.5">
                     <CheckCircle2 className="size-3" />
                     <span>Evaluation & Model Answer</span>
                  </span>
               </AccordionTrigger>
               <AccordionContent className="pb-0 pt-1">
                  <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-white/5 flex flex-col gap-2">
                     <div>
                        <span className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider">
                           Expected Answer
                        </span>
                        <PrimaryBody
                           text={question.expectedAnswer}
                           className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-300! mt-1 leading-relaxed"
                        />
                     </div>

                     {question.followUpQuestion && (
                        <div className="pt-2 border-t border-white/5">
                           <span className="text-[11px] uppercase font-semibold text-violet-400/90 tracking-wider flex items-center gap-1">
                              <HelpCircle className="size-3" />
                              Follow-Up Probe
                           </span>
                           <PrimaryBody
                              text={question.followUpQuestion}
                              className="text-xs! lg:text-xs! 2xl:text-xs! text-zinc-300! mt-1 leading-relaxed italic"
                           />
                        </div>
                     )}
                  </div>
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </div>
   );
};