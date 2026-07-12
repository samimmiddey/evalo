"use client"

import AuthContainer from './components/auth-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import GoogleButton from './components/google-button'
import ContinueDivider from './components/continue-divider'
import AuthHeader from './components/auth-header'
import AuthFooter from './components/auth-footer'
import { authData } from '@/data/auth/auth.data'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { authSchema, AuthSchemaTypes } from './schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { getClerkErrorMessage } from '@/utils/clerk-error'
import { useState } from 'react'
import CustomSpinner from '@/components/common/custom-spinner'

const SignIn = () => {
   const { signIn, errors, fetchStatus } = useSignIn();
   const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

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

   // Sign in with email and password
   const onSubmit = async (data: AuthSchemaTypes) => {
      setIsSigningIn(true);
      const emailAddress = data.email;
      const password = data.password;

      const { error } = await signIn.password({
         emailAddress,
         password,
      });

      if (error) {
         toast.error(getClerkErrorMessage(error));
         setIsSigningIn(false);
         return;
      };

      if (signIn.status === 'complete') {
         await signIn.finalize({
            navigate: () => router.push('/')
         });
         toast.success('Signed in successfully');
         reset();
      } else {
         toast.error(errors.global?.[0]?.message ?? 'Failed to sign in');
      }

      setIsSigningIn(false);
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
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="email">{authData.signIn.form.email.label}</Label>
               <Input
                  type={authData.signIn.form.email.type}
                  placeholder={authData.signIn.form.email.placeholder}
                  {...register(authData.signIn.form.email.name)}
               />
               {
                  formErrors[authData.signIn.form.email.name] && (
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {formErrors[authData.signIn.form.email.name]?.message}
                     </p>
                  )
               }
            </div>
            <div className="space-y-2 2xl:space-y-3">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password">{authData.signIn.form.password.label}</Label>
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
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
                     <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-2">
                        {formErrors[authData.signIn.form.password.name]?.message}
                     </p>
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
                        spinnerClass='text-gray-700'
                        textClass='text-gray-700'
                     /> :
                     authData.signIn.form.button
               }
            </Button>
         </form>

         {/* Continue divider */}
         <ContinueDivider />

         {/* Google auth button */}
         <GoogleButton />

         {/* Auth Footer */}
         <AuthFooter
            text={authData.signIn.footer.text}
            linkText={authData.signIn.footer.linkText}
            linkUrl={authData.signIn.footer.linkUrl}
         />

      </AuthContainer>
   )
}

export default SignIn;