import { LucideProps } from 'lucide-react';

interface HeaderTextProps {
   icon?: React.ComponentType<LucideProps>;
   text: string;
}

const HeaderText = ({ icon: Icon, text }: HeaderTextProps) => {
   return (
      <div
         className='text-violet-300 font-lobster text-[15px] 2xl:text-lg gap-2 flex items-center'
      >
         {Icon && <Icon className='h-4 2xl:h-5 w-4 2xl:w-5' />}
         {text}
      </div>
   );
};

export default HeaderText;