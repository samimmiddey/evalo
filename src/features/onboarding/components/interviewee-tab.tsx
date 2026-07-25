'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import SelectedRoleBadge from './selected-role-badge';

interface Props {
   onChangeRole: () => void;
}

const IntervieweeTab = ({ onChangeRole }: Props) => {
   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="space-y-6"
      >
         {/* Selected role */}
         <SelectedRoleBadge role="Interviewee" onChangeRole={onChangeRole} />

         {/* Context card */}
         <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 2xl:p-5 space-y-3.5 relative overflow-hidden">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                  <Sparkles className="w-4 h-4" />
               </div>
               <div>
                  <h4 className="text-sm font-semibold text-white">Interviewee Experience</h4>
                  <p className="text-xs text-zinc-400">Everything you need to practice and stand out</p>
               </div>
            </div>

            <ul className="space-y-2 pt-2 border-t border-white/5">
               <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>AI-powered interactive mock technical interviews</span>
               </li>
               <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Real-time feedback & instant candidate skill analytics</span>
               </li>
               <li className="flex items-center gap-2 text-xs text-zinc-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>Direct candidate profile visibility for hiring managers</span>
               </li>
            </ul>
         </div>

         {/* CTA */}
         <Button
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 group transition-all"
            size="lg"
            type="button"
            variant='white'
         >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </Button>
      </motion.div>
   );
};

export default IntervieweeTab;



