import { Badge } from '@/components/ui/badge';
import { User, Briefcase, RefreshCw } from 'lucide-react';

interface Props {
   role: string;
   onChangeRole: () => void;
}

const SelectedRoleBadge = ({ role, onChangeRole }: Props) => {
   const isInterviewee = role.toLowerCase() === 'interviewee';

   return (
      <div className="flex items-center justify-between text-xs">
         <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-violet-500/15 flex items-center justify-center text-violet-400">
               {isInterviewee ? <User className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
            </div>
            <span className="text-zinc-400 font-medium">Selected Role:</span>
            <Badge
               variant="secondary"
               className="capitalize text-xs font-semibold px-2.5 py-0.5 bg-violet-500/20 text-violet-300 border-violet-500/30 shadow-sm"
            >
               {role}
            </Badge>
         </div>

         <button
            type="button"
            onClick={onChangeRole}
            className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer group"
         >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Switch Role</span>
         </button>
      </div>
   );
};

export default SelectedRoleBadge;



