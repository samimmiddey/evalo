const InputError = ({ message }: { message?: string; }) => {
   return (
      <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1.5">
         {message}
      </p>
   );
};

export default InputError;