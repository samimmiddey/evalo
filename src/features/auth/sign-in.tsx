import AuthContainer from './components/auth-container'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import GoogleButton from './components/google-button'
import ContinueDivider from './components/continue-divider'
import AuthHeader from './components/auht-header'
import AuthFooter from './components/auth-footer'
import { authData } from '@/data/auth/auth.data'

const SignIn = () => {
   return (
      <AuthContainer>

         {/* Auth Header */}
         <AuthHeader
            title={authData.signIn.header.title}
            desc={authData.signIn.header.desc}
         />

         {/* Sign up form */}
         <form className="space-y-5">
            <div className="space-y-2 2xl:space-y-3">
               <Label htmlFor="email">{authData.signIn.form.email.label}</Label>
               <Input
                  name={authData.signIn.form.email.name}
                  type={authData.signIn.form.email.type}
                  placeholder={authData.signIn.form.email.placeholder}
               />
            </div>
            <div className="space-y-2 2xl:space-y-3">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password">{authData.signIn.form.password.label}</Label>
                  <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                     Forgot password?
                  </Link>
               </div>
               <Input
                  name={authData.signIn.form.password.name}
                  type={authData.signIn.form.password.type}
                  placeholder={authData.signIn.form.password.placeholder}
               />
            </div>

            <Button
               className="w-full h-11 font-medium font-inter"
               size="lg"
               variant="white"
            >
               {authData.signIn.form.button}
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