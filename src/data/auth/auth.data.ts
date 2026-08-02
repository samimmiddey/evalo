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
   },
   branding: {
      header: {
         titleNormal: 'High-fidelity talent validation ',
         titleHighlight: 'engineered for scale.',
         desc: 'Say goodbye to arbitrary tech assessments. Evalo analyzes architecture logic, performance limits, and security posture automatically.',
      },
      dashboard: {
         title: 'Candidate Assessment Report',
         status: 'READY TO HIRE',
         candidate: {
            name: 'Sarah Jenkins',
            role: 'Lead Infrastructure Engineer',
            score: '96',
            scoreLabel: '/100',
         },
         tabs: {
            architecture: {
               title: 'Architecture',
               checks: [
                  { label: 'Decoupled State Management', score: '98%' },
                  { label: 'Database Normalization Standard', score: '94%' },
               ],
               desc: 'Candidate demonstrated deep knowledge of scalable caching strategies and optimized database constraints under load simulation.',
            },
            optimization: {
               title: 'Optimization',
               checks: [
                  { label: 'Time Complexity Analysis (O(N))', score: '100%' },
                  { label: 'Memory Allocation & Leaks', score: '90%' },
               ],
               desc: 'Memory leaks checked automatically against mock telemetry runs. Execution times fell within the top 2% of candidates globally.',
            },
            quality: {
               title: 'Code Quality',
               checks: [
                  { label: 'Type Definitions & Coverage', score: '96%' },
                  { label: 'Linter Compliance & Readability', score: '100%' },
               ],
               desc: 'Candidate codebase contains rigorous type definitions, clean documentation, and follows standard object-oriented/functional paradigms.',
            },
         },
         aiRecommendation: {
            label: 'AI RECOMMENDATION',
            text: 'Strong Hire (Top 1%)',
         },
      },
      footer: {
         telemetry: 'TELEMETRY SYSTEMS ACTIVE',
         performance: 'REAL-TIME PERFORMANCE PROFILING',
      },
   }
}