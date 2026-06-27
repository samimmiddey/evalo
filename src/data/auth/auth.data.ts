import { AuthData } from "./auth.types";

export const authData: AuthData = {
   signIn: {
      header: {
         title: 'Welcome Back',
         desc: 'Sign in with your credentials to continue',
      },
      form: {
         email: {
            name: 'email',
            label: 'Email address',
            type: 'email',
            placeholder: 'name@example.com'
         },
         password: {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: '••••••••'
         },
         button: 'Sign In'
      },
      footer: {
         text: 'Already have an account?',
         linkText: 'Sign Up',
         linkUrl: '/sign-up',
      }
   },

   signUp: {
      header: {
         title: 'Create your account',
         desc: 'Join thousands of users who use Evalo to',
      },
      form: {
         email: {
            name: 'email',
            label: 'Email address',
            type: 'email',
            placeholder: 'name@example.com'
         },
         password: {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: '••••••••'
         },
         button: 'Sign Up'
      },
      footer: {
         text: 'Don\'t have an account?',
         linkText: 'Sign In',
         linkUrl: '/sign-in',
      }
   },

   otp: {
      header: {
         title: 'Verify your account',
         desc: 'Enter the verification code sent to your email address',
      },

      form: {
         code: {
            name: 'code',
            label: 'Verification code',
            type: 'text',
            placeholder: '••••••••'
         },
         button: 'Verify'
      }
   }
}