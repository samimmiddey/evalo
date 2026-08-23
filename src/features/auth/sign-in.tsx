"use client";

import AuthContainer from './components/auth-container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GoogleButton from './components/google-button';
import ContinueDivider from './components/continue-divider';
import AuthHeader from './components/auth-header';
import AuthFooter from './components/auth-footer';
import { authData } from '@/data/auth/auth.data';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { authSchema, AuthSchemaTypes, OtpSchemaTypes } from './schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import OTP from './otp';
import { useState } from 'react';
import CustomSpinner from '@/components/common/custom-spinner';
import {
   resendSignInVerificationCode,
   resetSignIn,
   signInWithPassword,
   verifySignInCode,
} from './services/auth.client.service';
import ScreenLoader from '@/components/common/screen-loader';
import InputError from '@/components/common/input-error';
import { useRoleBasedRedirect } from '@/hooks/use-role-based-redirect';
import { useRouter, useSearchParams } from 'next/navigation';
import { sanitizeRedirectUrl } from '@/utils/redirect-url-sanitizer';

const SignIn = () => {
   const { signIn, errors, fetchStatus } = useSignIn();
   const { isSignedIn } = useAuth();
   const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

   const router = useRouter();
   const searchParams = useSearchParams();
   const redirectUrl = searchParams.get('redirect_url');

   const roleBasedRedirect = useRoleBasedRedirect();

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

   const onNavigate = () => {
      const sanitizedRedirectUrl = sanitizeRedirectUrl(redirectUrl);
      if (sanitizedRedirectUrl) {
         router.replace(sanitizedRedirectUrl);
      } else {
         void roleBasedRedirect();
      }
   };

   // Sign in with email and password
   const onSubmit = async (data: AuthSchemaTypes) => {
      setIsSigningIn(true);

      const result = await signInWithPassword({
         signIn,
         emailAddress: data.email,
         password: data.password,
         errors,
         onNavigate,
      });

      if (result.success) {
         if (signIn.status === 'complete') {
            toast.success('Signed in successfully');
            reset();
         }
      } else {
         toast.error(result.message);
      }

      setIsSigningIn(false);
   };

   // Verify OTP
   const handleVerify = async (data: OtpSchemaTypes) => {
      const result = await verifySignInCode({
         signIn,
         code: data.code,
         errors,
         onNavigate,
      });

      if (result.success) {
         toast.success('Signed in successfully');
      } else {
         toast.error(result.message);
      }

      return result.success;
   };

   // Resend OTP
   const resendCode = async () => {
      const result = await resendSignInVerificationCode({ signIn });

      if (result.success) {
         toast.success('A new code has been sent');
      } else {
         toast.error(result.message);
      }
   };

   // Reset OTP flow to go back to sign in page
   const onBack = async () => {
      const result = await resetSignIn({ signIn });

      if (!result.success) {
         toast.error(result.message);
      }
   };

   // Show loader if clerk isn't loaded
   if (!signIn) {
      return <ScreenLoader text="Loading..." />;
   }

   // Show loader if sign in is complete or user is already signed in
   if (signIn.status === 'complete' || isSignedIn) {
      return (
         <ScreenLoader
            text="Redirecting..."
            className="min-h-screen fixed inset-0 z-99999 overflow-hidden bg-zinc-950"
         />
      );
   }

   // Show OTP form when second factor is needed
   if (signIn.status === 'needs_second_factor') {
      return (
         <OTP
            handleVerify={handleVerify}
            fetchStatus={fetchStatus}
            resendCode={resendCode}
            onBack={onBack}
         />
      );
   }

   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.signIn.header.title}
            desc={authData.signIn.header.desc}
         />

         {/* Sign up form */}
         <form
            className="space-y-5"
            onSubmit={(e) => {
               void handleSubmit(onSubmit)(e);
            }}
         >
            <div className="flex flex-col gap-2 2xl:gap-2.5">
               <Label htmlFor="email">{authData.signIn.form.email.label}</Label>
               <Input
                  type={authData.signIn.form.email.type}
                  placeholder={authData.signIn.form.email.placeholder}
                  {...register(authData.signIn.form.email.name)}
               />
               {
                  formErrors[authData.signIn.form.email.name] && (
                     <InputError
                        message={formErrors[authData.signIn.form.email.name]?.message}
                        className='-mt-0.5 2xl:-mt-1.5'
                     />
                  )
               }
            </div>
            <div className="flex flex-col gap-2 2xl:gap-2.5">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password">{authData.signIn.form.password.label}</Label>
                  <Link
                     href={
                        redirectUrl
                           ? `/forgot-password?redirect_url=${encodeURIComponent(redirectUrl)}`
                           : '/forgot-password'
                     }
                     className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                     Forgot password?
                  </Link>
               </div>
               <Input
                  type={authData.signIn.form.password.type}
                  placeholder={authData.signIn.form.password.placeholder}
                  {...register(authData.signIn.form.password.name)}
               />
               {
                  formErrors[authData.signIn.form.password.name] && (
                     <InputError
                        message={formErrors[authData.signIn.form.password.name]?.message}
                        className='-mt-0.5 2xl:-mt-1.5'
                     />
                  )
               }
            </div>

            <Button
               className="w-full h-11 font-medium font-inter"
               size="lg"
               variant="white"
               type='submit'
               disabled={fetchStatus === 'fetching' || isSigningIn}
            >
               {
                  isSigningIn ?
                     <CustomSpinner
                        text='Signing In...'
                        spinnerClass='text-zinc-700'
                        textClass='text-zinc-700'
                     /> :
                     authData.signIn.form.button
               }
            </Button>
         </form>

         {/* Continue divider */}
         <ContinueDivider />

         {/* Google auth button */}
         <GoogleButton sso={(params) => signIn.sso(params)} />

         {/* Auth Footer */}
         <AuthFooter
            text={authData.signIn.footer.text}
            linkText={authData.signIn.footer.linkText}
            linkUrl={authData.signIn.footer.linkUrl}
         />

      </AuthContainer>
   );
};

export default SignIn;