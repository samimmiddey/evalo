import AuthContainer from './components/auth-container'
import AuthHeader from './components/auth-header'
import { authData } from '@/data/auth/auth.data'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema, OtpSchemaTypes } from './schemas/auth.schema'

interface OTPProps {
   handleVerify: (data: OtpSchemaTypes) => Promise<void>;
   fetchStatus: string;
   sendNewCode: () => Promise<unknown> | void;
}

const OTP = ({ handleVerify, fetchStatus, sendNewCode }: OTPProps) => {
   const {
      register,
      handleSubmit,
      reset,
      formState:
      { errors: formErrors }
   } = useForm<OtpSchemaTypes>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
         code: '',
      }
   });

   const onSubmit = async (data: OtpSchemaTypes) => {
      await handleVerify(data);
      reset();
   }

   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.otp.header.title}
            desc={authData.otp.header.desc}
         />

         {/* Sign up form */}
         <form className="space-y-5" onSubmit={void handleSubmit(onSubmit)}>
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="code">{authData.otp.form.code.label}</Label>
               <Input
                  type={authData.otp.form.code.type}
                  placeholder={authData.otp.form.code.placeholder}
                  {...register('code')}
               />
               {
                  formErrors.code && (
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {formErrors.code?.message}
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
               disabled={fetchStatus === 'fetching'}
            >
               {fetchStatus === 'fetching' ? 'Verifying...' : authData.otp.form.button}
            </Button>
         </form>

         <button className='cursor-pointer hover:underline text-sm 2xl:text-base' onClick={() => void sendNewCode()}>I need a new code</button>
      </AuthContainer>
   )
}

export default OTP