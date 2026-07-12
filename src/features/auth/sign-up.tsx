'use client';

import AuthContainer from './components/auth-container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import GoogleButton from './components/google-button';
import ContinueDivider from './components/continue-divider';
import AuthHeader from './components/auth-header';
import AuthFooter from './components/auth-footer';
import { authData } from '@/data/auth/auth.data';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authSchema, AuthSchemaTypes, OtpSchemaTypes } from './schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import OTP from './otp';
import AuthRedirectionLoader from './components/auth-redirection-loader';

const SignUp = () => {
   const { signUp, errors, fetchStatus } = useSignUp();
   const { isSignedIn } = useAuth();
   const router = useRouter();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors: formErrors },
   } = useForm<AuthSchemaTypes>({
      resolver: zodResolver(authSchema),
      defaultValues: {
         email: '',
         password: '',
      }
   });

   // Sign up with email and password
   const onSubmit = async (data: AuthSchemaTypes) => {
      const emailAddress = data.email
      const password = data.password

      const { error } = await signUp.password({
         emailAddress,
         password,
      })

      if (error) {
         toast.error(error.message);
         return
      }

      if (!error) {
         const { error: verificationError } = await signUp.verifications.sendEmailCode();

         if (verificationError) {
            toast.error(verificationError.message);
            return;
         }

         reset();
      }
   }

   // Verify OTP
   const handleVerify = async (data: OtpSchemaTypes) => {
      const code = data.code;

      const { error } = await signUp.verifications.verifyEmailCode({
         code,
      });

      if (error) {
         toast.error(error.message);
         return false;
      }

      if (signUp.status === 'complete') {
         await signUp.finalize({
            navigate: () => router.push('/')
         });
         toast.success('Account created successfully');
         return true;
      } else {
         toast.error(errors.global?.[0]?.message ?? 'Failed to sign up');
         return false;
      }
   }

   // Resend OTP
   const resendCode = async () => {
      const { error } = await signUp.verifications.sendEmailCode();

      if (error) {
         toast.error(error.message);
      } else {
         toast.success('A new code has been sent.');
      }
   };

   if (signUp.status === 'complete' || isSignedIn) {
      return <AuthRedirectionLoader />;
   }

   if (
      signUp.status === 'missing_requirements' &&
      signUp.unverifiedFields.includes('email_address') &&
      signUp.missingFields.length === 0
   ) {
      return (
         <>
            <OTP
               handleVerify={handleVerify}
               fetchStatus={fetchStatus}
               resendCode={resendCode}
            />
         </>
      )
   }

   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.signUp.header.title}
            desc={authData.signUp.header.desc}
         />

         {/* Sign up form */}
         <form
            className="space-y-5"
            onSubmit={(e) => {
               void handleSubmit(onSubmit)(e);
            }}
         >
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="email">{authData.signUp.form.email.label}</Label>
               <Input
                  type={authData.signUp.form.email.type}
                  placeholder={authData.signUp.form.email.placeholder}
                  {...register(authData.signUp.form.email.name)}
               />
               {
                  formErrors[authData.signUp.form.email.name] && (
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {formErrors[authData.signUp.form.email.name]?.message}
                     </p>
                  )
               }
            </div>
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="password">{authData.signUp.form.password.label}</Label>
               <Input
                  type={authData.signUp.form.password.type}
                  placeholder={authData.signUp.form.password.placeholder}
                  {...register(authData.signUp.form.password.name)}
               />
               {
                  formErrors[authData.signUp.form.password.name] && (
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {formErrors[authData.signUp.form.password.name]?.message}
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
               {fetchStatus === 'fetching' ? 'Creating account...' : authData.signUp.form.button}
            </Button>
         </form>

         {/* Continue divider */}
         <ContinueDivider />

         {/* Google auth button */}
         <GoogleButton />

         {/* Auth Footer */}
         <AuthFooter
            text={authData.signUp.footer.text}
            linkText={authData.signUp.footer.linkText}
            linkUrl={authData.signUp.footer.linkUrl}
         />

      </AuthContainer>
   )
}

export default SignUp;