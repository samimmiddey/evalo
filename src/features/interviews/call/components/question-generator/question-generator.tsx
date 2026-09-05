"use client";

import { useState } from 'react';
import { useMutation } from '@/hooks/use-mutation';
import { handleGenerateQuestions } from '../../services/call.client.service';
import { EmptyCard } from './empty-card';
import { ExpertiseSlider } from './expertise-slider';
import { LoadingState } from './skeleton-card';
import { ErrorState } from './error-card';
import { QuestionsList } from './question-list';

interface QuestionGeneratorProps {
   expertise: string[];
}

const QuestionGenerator = ({ expertise }: QuestionGeneratorProps) => {
   const [selectedExpertise, setSelectedExpertise] = useState<string>('');

   const { isPending, error, data, mutate } = useMutation(handleGenerateQuestions);

   const handleExpertiseSelection = (item: string) => {
      setSelectedExpertise(item);
      void mutate(item);
   };

   const handleRetry = () => {
      if (selectedExpertise) {
         void mutate(selectedExpertise);
      }
   };

   return (
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-3 sm:p-4 text-zinc-400">
         {/* Expertise Slider */}
         <div className="shrink-0 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2 px-0.5">
               <span className="text-xs font-medium text-zinc-400">Select Domain</span>
               {selectedExpertise && (
                  <span className="text-[11px] text-emerald-400 font-mono">
                     {selectedExpertise.replace(/_/g, ' ')}
                  </span>
               )}
            </div>
            <ExpertiseSlider
               expertise={expertise}
               selectedExpertise={selectedExpertise}
               handleExpertiseSelection={handleExpertiseSelection}
               disabled={isPending}
            />
         </div>

         {/* Content Area */}
         <div className="flex-1 min-h-0 flex flex-col overflow-y-auto mt-4">
            {isPending ? (
               <LoadingState />
            ) : error ? (
               <ErrorState error={error} onRetry={handleRetry} />
            ) : data && data.length > 0 ? (
               <div className="h-full flex flex-col justify-start">
                  <QuestionsList
                     questions={data}
                     expertise={selectedExpertise}
                     onRegenerate={handleRetry}
                     isPending={isPending}
                  />
               </div>
            ) : (
               <EmptyCard />
            )}
         </div>
      </div>
   );
};

export default QuestionGenerator;