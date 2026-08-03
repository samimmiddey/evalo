import ScreenLoader from '@/components/common/screen-loader';

const Loading = () => {
   return (
      <div className='s-padding-t'>
         <ScreenLoader text="Loading interviewer details..." />
      </div>
   );
};

export default Loading;