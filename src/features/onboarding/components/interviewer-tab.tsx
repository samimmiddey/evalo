'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Briefcase, Building2, Clock, Compass, FileText, ArrowRight } from 'lucide-react';
import SelectedRoleBadge from './selected-role-badge';

const YEARS_OF_EXPERIENCE = [
   '1 yr', '2 yrs', '3 yrs', '4 yrs', '5 yrs',
   '6 yrs', '7 yrs', '8 yrs', '9 yrs', '10+ yrs',
];

const DOMAINS = [
   'Frontend', 'Backend', 'Full Stack', 'DevOps',
   'Mobile', 'Data Science', 'ML / AI', 'Security', 'QA', 'Cloud',
];

interface Props {
   onChangeRole: () => void;
}

const InterviewerTab = ({ onChangeRole }: Props) => {
   const [exp, setExp] = useState('5 yrs');
   const [domain, setDomain] = useState('Full Stack');

   return (
      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
         className="space-y-5"
      >
         {/* Selected role badge */}
         <SelectedRoleBadge role="Interviewer" onChangeRole={onChangeRole} />

         {/* Form */}
         <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

            {/* Designation + Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
               <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                     <Briefcase className="w-3.5 h-3.5 text-violet-400" />
                     Designation
                  </Label>
                  <Input
                     id="designation"
                     type="text"
                     placeholder="e.g. Senior Tech Lead"
                     className="text-sm!"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                     <Building2 className="w-3.5 h-3.5 text-violet-400" />
                     Company
                  </Label>
                  <Input
                     id="company"
                     type="text"
                     placeholder="e.g. Acme Inc or Freelance"
                     className="text-sm!"
                  />
               </div>
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
               <Label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  Years of Experience
               </Label>
               <ToggleGroup
                  type="single"
                  value={exp}
                  onValueChange={(val) => val && setExp(val)}
                  className="flex flex-wrap gap-1.5 w-full justify-start"
               >
                  {YEARS_OF_EXPERIENCE.map((year) => (
                     <ToggleGroupItem
                        key={year}
                        value={year}
                        aria-label={year}
                        className="text-xs h-7 px-3.5 rounded-full border border-white/10 bg-zinc-950/40 text-zinc-300 hover:bg-white/5 hover:text-white data-[state=on]:bg-violet-500/20 data-[state=on]:border-violet-500/50 data-[state=on]:text-violet-300 data-[state=on]:shadow-[0_0_12px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                     >
                        {year}
                     </ToggleGroupItem>
                  ))}
               </ToggleGroup>
            </div>

            {/* Domain */}
            <div className="space-y-2">
               <Label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-violet-400" />
                  Domain Expertise
               </Label>
               <ToggleGroup
                  type="single"
                  value={domain}
                  onValueChange={(val) => val && setDomain(val)}
                  className="flex flex-wrap gap-1.5 w-full justify-start"
               >
                  {DOMAINS.map((item) => (
                     <ToggleGroupItem
                        key={item}
                        value={item}
                        aria-label={item}
                        className="text-xs h-7 px-3.5 rounded-full border border-white/10 bg-zinc-950/40 text-zinc-300 hover:bg-white/5 hover:text-white data-[state=on]:bg-violet-500/20 data-[state=on]:border-violet-500/50 data-[state=on]:text-violet-300 data-[state=on]:shadow-[0_0_12px_rgba(139,92,246,0.2)] transition-all cursor-pointer"
                     >
                        {item}
                     </ToggleGroupItem>
                  ))}
               </ToggleGroup>
            </div>

            {/* About yourself */}
            <div className="space-y-2">
               <Label htmlFor="about" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  About yourself
               </Label>
               <Textarea
                  id="about"
                  placeholder="Share your background, expertise, and what you look for in candidates..."
                  className="min-h-22 text-sm! resize-none"
               />
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
         </form>
      </motion.div>
   );
};

export default InterviewerTab;



