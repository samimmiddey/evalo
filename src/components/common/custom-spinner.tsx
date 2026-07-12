import { Spinner } from '@/components/ui/spinner';

const CustomSpinner = ({ text }: { text: string }) => {
   return (
      <div className='flex items-center gap-2.5 2xl:gap-3'>
         <Spinner className='size-4.5 2xl:size-5 text-gray-300' />
         <p className='text-sm 2xl:text-[15px] text-gray-300'>{text}</p>
      </div>
   )
};

export default CustomSpinner;