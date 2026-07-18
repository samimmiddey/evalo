import type { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import type { OAuthStrategy } from "@clerk/shared/types";

type SignUpResource = NonNullable<ReturnType<typeof useSignUp>["signUp"]>;
type SignInResource = NonNullable<ReturnType<typeof useSignIn>["signIn"]>;
type SignUpErrors = ReturnType<typeof useSignUp>["errors"];
type SignInErrors = ReturnType<typeof useSignIn>["errors"];

export interface SignupParams {
   signUp: SignUpResource;
   emailAddress: string;
   password: string;
}

export interface AuthResult {
   success: boolean;
   message?: string;
}

export interface VerifyCodeParams {
   signUp: SignUpResource;
   code: string;
   errors: SignUpErrors;
   onNavigate: () => void;
}

export interface ResendCodeParams {
   signUp: SignUpResource;
}

export interface ResetSignUpParams {
   signUp: SignUpResource;
}

export interface SignInParams {
   signIn: SignInResource;
   emailAddress: string;
   password: string;
   errors: SignInErrors;
   onNavigate: () => void;
}

export interface SendResetCodeParams {
   signIn: SignInResource;
   email: string;
}

export interface VerifyResetCodeParams {
   signIn: SignInResource;
   code: string;
}

export interface SubmitNewPasswordParams {
   signIn: SignInResource;
   password: string;
   onNavigate: () => void;
}

export interface GoogleSsoParams {
   sso: (params: {
      strategy: OAuthStrategy;
      redirectCallbackUrl: string;
      redirectUrl: string;
   }) => Promise<{ error: unknown; }>;
}

export interface SsoCallbackParams {
   clerk: ReturnType<typeof useClerk>;
   signIn: SignInResource;
   signUp: SignUpResource;
   onNavigate: () => void;
   onTransferToSignIn: () => void;
}