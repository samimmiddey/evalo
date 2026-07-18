'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AuthContainer from './components/auth-container';
import AuthHeader from './components/auth-header';
import { authData } from '@/data/auth/auth.data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CustomSpinner from '@/components/common/custom-spinner';
import { useForm } from 'react-hook-form';
import { forgotPasswordEmailSchema, ForgotPasswordSchemaEmailTypes } from './schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import ScreenLoader from '@/components/common/screen-loader';
import { sendResetCode, submitNewPassword, verifyResetCode } from './services/auth.service';

export default function ForgotPassword() {
   const { signIn, fetchStatus } = useSignIn();

   const [codeSent, setCodeSent] = useState(false);
   const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
   const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
   const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);
   const [isCompleting, setIsCompleting] = useState<boolean>(false);

   const router = useRouter();

   const {
      register,
      trigger,
      getValues,
      formState: { errors: formErrors }
   } = useForm<ForgotPasswordSchemaEmailTypes>({
      resolver: zodResolver(forgotPasswordEmailSchema),
      defaultValues: {
         email: '',
         code: '',
         password: ''
      }
   });

   // Step 1: Send the password reset code to the user's email
   async function handleSendCode(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('email');
      if (!valid) return;

      setIsSendingCode(true);

      const data = getValues();

      const result = await sendResetCode({ signIn, email: data.email });

      if (!result.success) {
         toast.error(result.message);
         setIsSendingCode(false);
         return;
      }

      setCodeSent(true);
      setIsSendingCode(false);
   }

   // Step 2: Verify the code provided by the user
   async function handleVerifyCode(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('code');
      if (!valid) return;

      setIsVerifyingCode(true);

      const data = getValues();

      const result = await verifyResetCode({ signIn, code: data.code });

      if (!result.success) {
         toast.error(result.message);
      }

      setIsVerifyingCode(false);
   }

   // Step 3: Submit the new password
   async function handleSubmitNewPassword(e: React.FormEvent) {
      e.preventDefault();

      const valid = await trigger('password');
      if (!valid) return;

      setIsSubmittingPassword(true);

      const data = getValues();

      setIsCompleting(true);

      const result = await submitNewPassword({
         signIn,
         password: data.password,
         onNavigate: () => router.push('/'),
      });

      if (!result.success) {
         setIsCompleting(false);
         toast.error(result.message);
         setIsSubmittingPassword(false);
         return;
      }

      toast.success('Password reset successfully and signed you in');
      setIsSubmittingPassword(false);
   }

   // Check if clerk is loaded
   if (!signIn) {
      return <ScreenLoader text="Loading..." />;
   }

   // Determine the current step based on the sign-in status and whether the code has been sent
   const currentStep: "stepOne" | "stepTwo" | "stepThree" =
      signIn.status === 'needs_new_password'
         ? 'stepThree'
         : codeSent
            ? 'stepTwo'
            : 'stepOne';

   return (
      <>
         {isCompleting ? (
            <ScreenLoader text='Signing you in...' />
         ) : (
            <AuthContainer>

               {/* Auth Header */}
               <AuthHeader
                  title={authData.forgotPassword[currentStep].header.title}
                  desc={authData.forgotPassword[currentStep].header.desc}
               />

               <>
                  {/* Step 1 UI: Collect the user's email so you can send them a password reset code */}
                  {!codeSent && (
                     <form onSubmit={e => void handleSendCode(e)} className="space-y-5">
                        <div className="space-y-2 2xl:space-y-3">
                           <Label htmlFor="email">{authData.forgotPassword.stepOne.form.email.label}</Label>
                           <Input
                              type={authData.forgotPassword.stepOne.form.email.type}
                              placeholder={authData.forgotPassword.stepOne.form.email.placeholder}
                              {...register(authData.forgotPassword.stepOne.form.email.name)}
                           />
                           {
                              formErrors[authData.forgotPassword.stepOne.form.email.name] && (
                                 <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1.5">
                                    {formErrors[authData.forgotPassword.stepOne.form.email.name]?.message}
                                 </p>
                              )
                           }
                        </div>
                        <Button
                           className="w-full h-11 font-medium font-inter"
                           size="lg"
                           variant="white"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isSendingCode}
                        >
                           {
                              isSendingCode ?
                                 <CustomSpinner
                                    text='Sending Code...'
                                    spinnerClass='text-gray-700'
                                    textClass='text-gray-700'
                                 /> :
                                 authData.forgotPassword.stepOne.form.button
                           }
                        </Button>
                     </form>
                  )}

                  {/* Step 2 UI: Collect the code provided by the user */}
                  {codeSent && signIn.status !== 'needs_new_password' && (
                     <form onSubmit={e => void handleVerifyCode(e)} className="space-y-5">
                        <div className="space-y-2 2xl:space-y-3">
                           <Label htmlFor="code">{authData.forgotPassword.stepTwo.form.code.label}</Label>
                           <Input
                              type={authData.forgotPassword.stepTwo.form.code.type}
                              placeholder={authData.forgotPassword.stepTwo.form.code.placeholder}
                              {...register(authData.forgotPassword.stepTwo.form.code.name)}
                           />
                           {
                              formErrors[authData.forgotPassword.stepTwo.form.code.name] && (
                                 <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1.5">
                                    {formErrors[authData.forgotPassword.stepTwo.form.code.name]?.message}
                                 </p>
                              )
                           }
                        </div>
                        <Button
                           className="w-full h-11 font-medium font-inter"
                           size="lg"
                           variant="white"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isVerifyingCode}
                        >
                           {
                              isVerifyingCode ?
                                 <CustomSpinner
                                    text='Sending Code...'
                                    spinnerClass='text-gray-700'
                                    textClass='text-gray-700'
                                 /> :
                                 authData.forgotPassword.stepTwo.form.button
                           }
                        </Button>
                     </form>
                  )}

                  {/* Step 3 UI: Collect the new password from the user */}
                  {signIn.status === 'needs_new_password' && (
                     <form onSubmit={e => void handleSubmitNewPassword(e)} className="space-y-5">
                        <div className="space-y-2 2xl:space-y-3">
                           <Label htmlFor="password">{authData.forgotPassword.stepThree.form.password.label}</Label>
                           <Input
                              type={authData.forgotPassword.stepThree.form.password.type}
                              placeholder={authData.forgotPassword.stepThree.form.password.placeholder}
                              {...register(authData.forgotPassword.stepThree.form.password.name)}
                           />
                           {
                              formErrors[authData.forgotPassword.stepThree.form.password.name] && (
                                 <p className="text-red-400 text-xs 2xl:text-sm -mt-0.5 2xl:-mt-1.5">
                                    {formErrors[authData.forgotPassword.stepThree.form.password.name]?.message}
                                 </p>
                              )
                           }
                        </div>
                        <Button
                           className="w-full h-11 font-medium font-inter"
                           size="lg"
                           variant="white"
                           type='submit'
                           disabled={fetchStatus === 'fetching' || isSubmittingPassword}
                        >
                           {
                              isSubmittingPassword ?
                                 <CustomSpinner
                                    text='Updating Password...'
                                    spinnerClass='text-gray-700'
                                    textClass='text-gray-700'
                                 /> :
                                 authData.forgotPassword.stepThree.form.button
                           }
                        </Button>
                     </form>
                  )}
               </>
            </AuthContainer>
         )}
      </>
   );
}