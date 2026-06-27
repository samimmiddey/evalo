import AuthContainer from './components/auth-container'
import AuthHeader from './components/auht-header'
import { authData } from '@/data/auth/auth.data'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface OTPProps {
   handleVerify: () => Promise<void>;
   fetchStatus: string;
   errors: {
      fields: {
         code?: string
      }
   };
   sendNewCode: () => Promise<void>;
}

const OTP = ({ handleVerify, fetchStatus, errors, sendNewCode }: OTPProps) => {
   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.otp.header.title}
            desc={authData.otp.header.desc}
         />

         {/* Sign up form */}
         <form className="space-y-5" onSubmit={handleVerify}>
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="code">{authData.otp.form.code.label}</Label>
               <Input
                  type={authData.otp.form.code.type}
                  placeholder={authData.otp.form.code.placeholder}
               />
               {
                  errors.fields.code && (
                     <p className="text-red-500 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {errors.fields.code}
                     </p>
                  )
               }
            </div>

            {/* Clerk's CAPTCHA widget */}
            <div id="clerk-captcha" />

            <Button
               className="w-full h-11 font-medium font-inter"
               size="lg"
               variant="white"
               type='submit'
               disabled={fetchStatus === 'fetching'}
            >
               {fetchStatus === 'fetching' ? 'Creating account...' : authData.otp.form.button}
            </Button>
         </form>

      </AuthContainer>
   )
}

export default OTP