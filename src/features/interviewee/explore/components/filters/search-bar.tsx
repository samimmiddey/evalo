import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar = () => {
   return (
      <div className="relative w-full md:w-87.5 shrink-0">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
         <Input
            placeholder="Search by name, role, or company..."
            className="w-full pl-10 bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500 h-11"
         />
      </div>
   );
};

export default SearchBar;