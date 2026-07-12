import CustomSpinner from '@/components/common/custom-spinner'

const AuthRedirectionLoader = ({ text }: { text: string }) => {
   return (
      <div className="container">
         <div
            className='border-gray-400/25! bg-gray-600/15! px-3.5 2xl:px-4 h-10 2xl:h-11 flex items-center border rounded-md w-max mx-auto my-40 2xl:my-50'
         >
            <CustomSpinner text={text} />
         </div>
      </div>
   )
}

export default AuthRedirectionLoader