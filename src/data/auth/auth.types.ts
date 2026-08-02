import { AuthSchemaTypes, ForgotPasswordSchemaEmailTypes } from "@/features/auth/schemas/auth.schema";

export interface HeaderProps {
   title: string;
   desc: string;
}

export interface InputProps {
   name: keyof AuthSchemaTypes;
   label: string;
   type: string;
   placeholder: string;
}

export interface FormProps {
   email: InputProps;
   password: InputProps;
   button: string;
}

export interface FooterProps {
   text: string;
   linkText: string;
   linkUrl: string;
}

export interface OtpFormProps {
   code: {
      name: string;
      label: string;
      type: string;
      placeholder: string;
   };
   button: string;
}

export interface StepOneFormProps {
   email: {
      name: keyof ForgotPasswordSchemaEmailTypes;
      label: string;
      type: string;
      placeholder: string;
   };
   button: string;
}

export interface StepTwoFormProps {
   code: {
      name: keyof ForgotPasswordSchemaEmailTypes;
      label: string;
      type: string;
      placeholder: string;
   };
   button: string;
}

export interface StepThreeFormProps {
   password: {
      name: keyof ForgotPasswordSchemaEmailTypes;
      label: string;
      type: string;
      placeholder: string;
   };
   button: string;
}

export interface BrandingProps {
   header: {
      titleNormal: string;
      titleHighlight: string;
      desc: string;
   };
   dashboard: {
      title: string;
      status: string;
      candidate: {
         name: string;
         role: string;
         score: string;
         scoreLabel: string;
      };
      tabs: {
         architecture: {
            title: string;
            checks: { label: string; score: string }[];
            desc: string;
         };
         optimization: {
            title: string;
            checks: { label: string; score: string }[];
            desc: string;
         };
         quality: {
            title: string;
            checks: { label: string; score: string }[];
            desc: string;
         };
      };
      aiRecommendation: {
         label: string;
         text: string;
      };
   };
   footer: {
      telemetry: string;
      performance: string;
   };
}

export interface AuthData {
   signIn: {
      header: HeaderProps;
      form: FormProps;
      footer: FooterProps;
   },
   signUp: {
      header: HeaderProps;
      form: FormProps;
      footer: FooterProps;
   },
   otp: {
      header: HeaderProps;
      form: OtpFormProps;
   },
   forgotPassword: {
      stepOne: {
         header: HeaderProps;
         form: StepOneFormProps;
      },
      stepTwo: {
         header: HeaderProps;
         form: StepTwoFormProps;
      },
      stepThree: {
         header: HeaderProps;
         form: StepThreeFormProps;
      }
   },
   branding: BrandingProps;
}