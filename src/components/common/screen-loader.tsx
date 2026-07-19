import CustomSpinner from "./custom-spinner";

const ScreenLoader = ({ text }: { text: string; }) => {
   return (
      <div className="w-full flex items-center justify-center min-h-[56vh]">
         <div
            className='border-gray-400/25! bg-gray-600/15! px-3.5 2xl:px-4 h-10 2xl:h-11 flex items-center border rounded-md w-max'
         >
            <CustomSpinner text={text} />
         </div>
      </div>
   );
};

export default ScreenLoader;