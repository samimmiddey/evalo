import PrimaryBody from '@/components/common/primary-body';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBar = () => {
   return (
      <div className="flex flex-col gap-2.5 2xl:gap-3">
         <PrimaryBody className="text-sm! font-medium! text-zinc-300! max-lg:hidden" text='Search' />
         <div className="relative w-full shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
               placeholder="Search interviewers..."
               className="w-full pl-10 text-sm!"
            />
         </div>
      </div>
   );
};

export default SearchBar;