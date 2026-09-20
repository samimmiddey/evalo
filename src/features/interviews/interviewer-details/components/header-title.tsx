import { LucideIcon } from 'lucide-react';

interface HeaderTitleProps {
   title: string;
   icon: LucideIcon;
}

const HeaderTitle = ({ title, icon: Icon }: HeaderTitleProps) => {
   return (
      <h2 className="text-lg 2xl:text-xl font-semibold font-geist text-zinc-100 flex items-center gap-2.5">
         <Icon className="h-4 2xl:w-5 w-4 2xl:h-5 text-violet-400 -mt-px" />
         {title}
      </h2>
   );
};

export default HeaderTitle;