"use client";

import AuthContainer from './components/auth-container';
import AuthHeader from './components/auth-header';
import { authData } from '@/data/auth/auth.data';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpSchemaTypes } from './schemas/auth.schema';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/auth-store';
import CustomSpinner from '@/components/common/custom-spinner';
import { toast } from 'sonner';
import { useSignUp } from '@clerk/nextjs';
import { resetSignUp } from './services/auth.service';

type SignUpType = ReturnType<typeof useSignUp>['signUp'];

interface OTPProps {
   handleVerify: (data: OtpSchemaTypes) => Promise<boolean>;
   fetchStatus: string;
   resendCode: () => Promise<unknown> | void;
   signUp: SignUpType;
}

const OTP = ({ handleVerify, fetchStatus, resendCode, signUp }: OTPProps) => {
   const { otpExpiresAt, setOtpExpiresAt, hasRequestedResend, setHasRequestedResend } = useAuthStore();
   const [now, setNow] = useState(() => Date.now());
   const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);

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
      setIsOtpVerifying(true);
      const success = await handleVerify(data);
      if (success) {
         setOtpExpiresAt(null);
         setHasRequestedResend(false);
         reset();
      }
      setIsOtpVerifying(false);
   };

   // Derived value from auth store
   const timeLeft = otpExpiresAt
      ? Math.max(0, Math.ceil((otpExpiresAt - now) / 1000))
      : 0;

   // Force re-render every second while otpExpiresAt is not null
   useEffect(() => {
      if (!otpExpiresAt) return;

      const tick = () => {
         const currentNow = Date.now();
         setNow(currentNow);

         if (otpExpiresAt - currentNow <= 0) {
            setOtpExpiresAt(null);
         }
      };

      // Resync immediately - handles delayed rehydration on refresh and keeps ticking every second
      const syncTimeout = setTimeout(tick, 0);
      const interval = setInterval(tick, 1000);

      return () => {
         clearTimeout(syncTimeout);
         clearInterval(interval);
      };
   }, [otpExpiresAt, setOtpExpiresAt]);

   // Reset OTP flow to go back to sign up page
   const onBack = async () => {
      if (!signUp) return;

      const result = await resetSignUp({ signUp });

      if (!result.success) {
         toast.error(result.message);
         return;
      }

      setOtpExpiresAt(null);
      setHasRequestedResend(false);
   };

   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.otp.header.title}
            desc={authData.otp.header.desc}
         />

         {/* Sign up form */}
         <form
            className="space-y-5"
            onSubmit={(e) => {
               void handleSubmit(onSubmit)(e);
            }}
         >
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="code">{authData.otp.form.code.label}</Label>
               <Input
                  type={authData.otp.form.code.type}
                  placeholder={authData.otp.form.code.placeholder}
                  {...register('code')}
               />
               {
                  formErrors.code && (
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1.5">
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
               disabled={fetchStatus === 'fetching' || isOtpVerifying}
            >
               {
                  isOtpVerifying ?
                     <CustomSpinner
                        text='Verifying...'
                        spinnerClass='text-gray-700'
                        textClass='text-gray-700'
                     />
                     : authData.otp.form.button
               }
            </Button>
         </form>

         <div className="flex flex-col items-center gap-6 2xl:gap-8 text-center">
            <button
               className='cursor-pointer not-disabled:hover:underline text-sm 2xl:text-base disabled:opacity-50 disabled:cursor-not-allowed'
               onClick={() => {
                  void resendCode();
                  const expiresAt = Date.now() + 60000;
                  setOtpExpiresAt(expiresAt);
                  setNow(Date.now());
                  setHasRequestedResend(true);
               }}
               disabled={timeLeft > 0 || fetchStatus === 'fetching'}
            >
               {timeLeft > 0
                  ? `Resend code (${timeLeft})`
                  : hasRequestedResend
                     ? 'Resend code'
                     : 'I need a new code'}
            </button>
            <Button
               variant='secondary'
               className='flex items-center gap-3 text-gray-300'
               onClick={() => void onBack()}
               type='button'
            >
               Use a different email
            </Button>
         </div>

      </AuthContainer>
   );
};

export default OTP;