import { AuthSchemaTypes } from "@/features/auth/schemas/auth.schema";

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
   }
}