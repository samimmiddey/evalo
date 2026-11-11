import { getClerkErrorMessage } from "@/utils/clerk-error";
import { CHECK_AUTH_STATUS } from "@/constants/query-urls";
import { api } from "@/lib/api";
import { apiError } from "@/lib/api-error";
import { BaseResponse } from "@/types/api.types";
import { toast } from "sonner";
import { checkBannedUser } from "../util/check-banned-user";
import {
   SignupParams,
   AuthResult,
   VerifyCodeParams,
   ResendCodeParams,
   SignInParams,
   VerifySignInCodeParams,
   ResendSignInCodeParams,
   ResetSignInParams,
   SendResetCodeParams,
   VerifyResetCodeParams,
   SubmitNewPasswordParams,
   GoogleSsoParams,
   ResetSignUpParams,
   SsoCallbackParams,
   CheckAccountStatusResponse,
} from "../types/auth.types";
import { sanitizeRedirectUrl } from "@/utils/redirect-url-sanitizer";

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

// Check if user account is banned
export const checkAccountStatus = async (email: string): Promise<CheckAccountStatusResponse> => {
   try {
      const res = await api
         .post(CHECK_AUTH_STATUS, { json: { email } })
         .json<BaseResponse<CheckAccountStatusResponse>>();

      if (!res.success) {
         throw new Error(res.error);
      }

      return res.data;
   } catch (error: unknown) {
      return apiError({
         error,
         fallbackMessage: "Failed to verify account status"
      });
   }
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
   }

   if (signIn.status === "complete") {
      await signIn.finalize({ navigate: onNavigate });
      return { success: true };
   }

   if (signIn.status === "needs_second_factor" || signIn.status === "needs_client_trust") {
      const { error: sendCodeError } = await signIn.mfa.sendEmailCode();
      if (sendCodeError) {
         return { success: false, message: getClerkErrorMessage(sendCodeError) };
      }
      return { success: true };
   }

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign in",
   };
};

// Verify sign-in 2FA OTP
export const verifySignInCode = async ({
   signIn,
   code,
   errors,
   onNavigate,
}: VerifySignInCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.mfa.verifyEmailCode({ code });

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   if (signIn.status === "complete") {
      await signIn.finalize({ navigate: onNavigate });
      return { success: true };
   }

   return {
      success: false,
      message: errors.global?.[0]?.message ?? "Failed to sign in",
   };
};

// Resend sign-in 2FA OTP
export const resendSignInVerificationCode = async ({
   signIn,
}: ResendSignInCodeParams): Promise<AuthResult> => {
   const { error } = await signIn.mfa.sendEmailCode();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
};

// Reset sign-in flow (go back to sign-in form)
export const resetSignIn = async ({
   signIn,
}: ResetSignInParams): Promise<AuthResult> => {
   const { error } = await signIn.reset();

   if (error) {
      return { success: false, message: getClerkErrorMessage(error) };
   }

   return { success: true };
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
export const signInWithGoogle = async ({ sso, redirectUrl }: GoogleSsoParams): Promise<AuthResult> => {
   const sanitizedUrl = sanitizeRedirectUrl(redirectUrl);
   const callbackUrl = sanitizedUrl ? `/sso-callback?redirect_url=${encodeURIComponent(sanitizedUrl)}` : '/sso-callback';
   const finalUrl = sanitizedUrl || '/';
   const { error } = await sso({
      strategy: 'oauth_google',
      redirectCallbackUrl: callbackUrl,
      redirectUrl: finalUrl
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
   onNavigateSignIn,
   onNavigateSignUp,
   onTransferToSignIn,
}: SsoCallbackParams): Promise<void> => {
   try {
      // 1. Intercept Clerk native ban or verification errors
      const verificationError =
         signIn.firstFactorVerification?.error ||
         signUp.verifications?.externalAccount?.error;

      if (verificationError) {
         const isBanned =
            verificationError.code === "user_banned" ||
            verificationError.message?.toLowerCase().includes("banned");
         toast.error(
            isBanned
               ? "Your account has been suspended. Please contact support."
               : (verificationError.longMessage || verificationError.message || "Failed to sign in with Google")
         );
         await clerk.signOut();
         onTransferToSignIn();
         return;
      }

      // 2. Check if the returning email is banned in our database
      const email = signUp.emailAddress || signIn.identifier;
      if (email && (await checkBannedUser(email))) {
         await clerk.signOut();
         onTransferToSignIn();
         return;
      }

      // 3. Returning Google user — sign-in is complete
      if (signIn.status === 'complete') {
         await signIn.finalize({ navigate: onNavigateSignIn });
         return;
      }

      // 4. Google account already exists as a Clerk user — transfer sign-up to sign-in
      if (signUp.isTransferable) {
         const { error: transferError } = await signIn.create({ transfer: true });
         if (transferError) throw transferError;

         const transferEmail = signUp.emailAddress || signIn.identifier;
         if (transferEmail && (await checkBannedUser(transferEmail))) {
            await clerk.signOut();
            onTransferToSignIn();
            return;
         }

         const signInStatus = signIn.status as typeof signIn.status | 'complete';
         if (signInStatus === 'complete') {
            await signIn.finalize({ navigate: onNavigateSignIn });
            return;
         }
         onTransferToSignIn();
         return;
      }

      // 5. New Google user — transfer sign-in attempt to a sign-up
      if (signIn.isTransferable) {
         const { error: transferError } = await signUp.create({ transfer: true });
         if (transferError) throw transferError;
         const transferEmail = signUp.emailAddress || signIn.identifier;
         if (transferEmail && (await checkBannedUser(transferEmail))) {
            await clerk.signOut();
            onTransferToSignIn();
            return;
         }

         if (signUp.status === 'complete') {
            await signUp.finalize({ navigate: onNavigateSignUp });
            return;
         }
         onTransferToSignIn();
         return;
      }

      // 6. New Google sign-up is complete
      if (signUp.status === 'complete') {
         await signUp.finalize({ navigate: onNavigateSignUp });
         return;
      }

      // 7. User already has an active session on this client — activate it directly
      if (signIn.existingSession || signUp.existingSession) {
         const sessionId = signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
         if (sessionId) {
            await clerk.setActive({
               session: sessionId,
               navigate: onNavigateSignIn
            });
            return;
         }
      }

      // 8. Fallback in case none of the states matched so user isn't stuck on loader
      toast.error("Failed to sign in with Google. Please try again.");
      await clerk.signOut();
      onTransferToSignIn();
   } catch (error: unknown) {
      const message =
         error && typeof error === "object"
            ? getClerkErrorMessage(error)
            : "Failed to sign in with Google";
      const isBanned = message.toLowerCase().includes("banned");
      toast.error(isBanned ? "Your account has been suspended. Please contact support." : message);
      await clerk.signOut();
      onTransferToSignIn();
   }
};