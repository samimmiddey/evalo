import { getClerkErrorMessage } from "@/utils/clerk-error";
import { SignupParams, AuthResult, VerifyCodeParams, ResendCodeParams, SignInParams, SendResetCodeParams, VerifyResetCodeParams, SubmitNewPasswordParams, GoogleSsoParams, ResetSignUpParams, SsoCallbackParams } from "../models/auth.types";

// Sign up with password
export const signupWithPassword = async ({
   signUp,
   emailAddress,
   password,
}: SignupParams): Promise<AuthResult> => {
   const { error } = await signUp.password({ emailAddress, password });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   const { error: verificationError } = await signUp.verifications.sendEmailCode();

   if (verificationError) {
      return { success: false, message: getClerkErrorMessage(verificationError) };
   }

   return { success: true };
};

// Verify OTP
export const verifyCode = async ({
   signUp,
   code,
   errors,
   onNavigate,
}: VerifyCodeParams): Promise<AuthResult> => {
   const { error } = await signUp.verifications.verifyEmailCode({ code });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signUp.status === "complete") {
      await signUp.finalize({ navigate: onNavigate });
      return { success: true };
   }

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign up",
   };
};

// Resend OTP
export const resendVerificationCode = async ({ signUp }: ResendCodeParams): Promise<AuthResult> => {
   const { error } = await signUp.verifications.sendEmailCode();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   };

   return { success: true };
};

// Reset sign-up flow (go back to sign-up form)
export const resetSignUp = async ({ signUp }: ResetSignUpParams): Promise<AuthResult> => {
   const { error } = await signUp.reset();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Sign in with password
export const signInWithPassword = async ({
   signIn,
   emailAddress,
   password,
   errors,
   onNavigate,
}: SignInParams): Promise<AuthResult> => {
   const { error } = await signIn.password({ emailAddress, password });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   };

   if (signIn.status === "complete") {
      await signIn.finalize({ navigate: onNavigate });
      return { success: true };
   };

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign in"
   };
};

// Step 1: Send password reset code
export const sendResetCode = async ({
   signIn,
   email,
}: SendResetCodeParams): Promise<AuthResult> => {
   const { error: createError } = await signIn.create({ identifier: email });

   if (createError) {
      return { success: false, message: getClerkErrorMessage(createError) };
   }

   const { error: sendCodeError } = await signIn.resetPasswordEmailCode.sendCode();

   if (sendCodeError) {
      return { success: false, message: getClerkErrorMessage(sendCodeError) };
   }

   return { success: true };
};

// Step 2: Verify reset code
export const verifyResetCode = async ({
   signIn,
   code,
}: VerifyResetCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Step 3: Submit new password
export const submitNewPassword = async ({
   signIn,
   password,
   onNavigate,
}: SubmitNewPasswordParams): Promise<AuthResult> => {
   const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
   });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signIn.status === "complete") {
      const { error: finalizeError } = await signIn.finalize({ navigate: onNavigate });

      if (finalizeError) {
         return { success: false, message: getClerkErrorMessage(finalizeError) };
      }

      return { success: true };
   }

   return { success: false, message: "Failed to reset password. Please try again" };
};

// Google OAuth sign-in/sign-up
export const signInWithGoogle = async ({ sso }: GoogleSsoParams): Promise<AuthResult> => {
   const { error } = await sso({
      strategy: 'oauth_google',
      redirectCallbackUrl: '/sso-callback',
      redirectUrl: '/dashboard',
   });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Handle OAuth (SSO) callback after redirect from Google/etc.
export const ssoCallback = async ({
   clerk,
   signIn,
   signUp,
   onNavigate,
   onTransferToSignIn,
}: SsoCallbackParams): Promise<void> => {
   // Returning Google user — sign-in is complete
   if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: onNavigate });
      return;
   }

   // Google account already exists as a Clerk user — transfer sign-up to sign-in
   if (signUp.isTransferable) {
      await signIn.create({ transfer: true });
      const signInStatus = signIn.status as typeof signIn.status | 'complete';
      if (signInStatus === 'complete') {
         await signIn.finalize({ navigate: onNavigate });
         return;
      }
      onTransferToSignIn();
      return;
   }

   // New Google user — transfer sign-in attempt to a sign-up
   if (signIn.isTransferable) {
      await signUp.create({ transfer: true });
      if (signUp.status === 'complete') {
         await signUp.finalize({ navigate: onNavigate });
         return;
      }
      onTransferToSignIn();
      return;
   }

   // New Google sign-up is complete
   if (signUp.status === 'complete') {
      await signUp.finalize({ navigate: onNavigate });
      return;
   }

   // User already has an active session on this client — activate it directly
   if (signIn.existingSession || signUp.existingSession) {
      const sessionId = signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
      if (sessionId) {
         await clerk.setActive({
            session: sessionId,
            navigate: onNavigate
         });
      }
   }
};