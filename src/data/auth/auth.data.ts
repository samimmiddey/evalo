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
   },

   forgotPassword: {
      stepOne: {
         header: {
            title: 'Forgot your password?',
            desc: 'Enter your email address and we\'ll send you a verification code to reset it',
         },
         form: {
            email: {
               name: 'email',
               label: 'Email address',
               type: 'email',
               placeholder: 'name@example.com'
            },
            button: 'Send Verification Code'
         }
      },
      stepTwo: {
         header: {
            title: 'Verify your email',
            desc: 'We have sent a verification code to your email address',
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
      },
      stepThree: {
         header: {
            title: 'Reset your password',
            desc: 'Enter your new password and we\'ll update it',
         },
         form: {
            password: {
               name: 'password',
               label: 'New password',
               type: 'password',
               placeholder: '••••••••'
            },
            button: 'Reset Password'
         }
      }
   }
}