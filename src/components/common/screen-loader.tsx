import CustomSpinner from "./custom-spinner";

const ScreenLoader = ({ text }: { text: string; }) => {
   return (
      <div
         className='border-gray-400/25! bg-gray-600/15! px-3.5 2xl:px-4 h-10 2xl:h-11 flex items-center border rounded-md w-max mx-auto my-[22vh]'
      >
         <CustomSpinner text={text} />
      </div>
   );
};

export default ScreenLoader;