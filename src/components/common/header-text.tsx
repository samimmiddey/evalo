import { LucideProps } from 'lucide-react'

interface HeaderTextProps {
   icon?: React.ComponentType<LucideProps>
   text: string;
}

const HeaderText = ({ icon: Icon, text }: HeaderTextProps) => {
   return (
      <div
         className='border-violet-400/25! bg-violet-600/15! text-violet-300 hover:translate-y-0 font-lobster text-[15px] 2xl:text-lg gap-2 px-2.5 2xl:px-3 py-1.25 cursor-default flex items-center border rounded-lg'
      >
         {Icon && <Icon className='h-4 2xl:h-5 w-4 2xl:w-5' />}
         {text}
      </div>
   )
}

export default HeaderText