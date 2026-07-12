'use client'

import AuthRedirectionLoader from '@/features/auth/components/auth-redirection-loader'
import { useClerk, useSignIn, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Page() {
   const clerk = useClerk()
   const { signIn } = useSignIn()
   const { signUp } = useSignUp()
   const router = useRouter()
   const hasRun = useRef(false)

   const finalizeSignIn = async () => {
      await signIn.finalize({
         navigate: async () => {
            router.push('/')
         },
      })
   }

   const finalizeSignUp = async () => {
      await signUp.finalize({
         navigate: async () => {
            router.push('/')
         },
      })
   }

   useEffect(() => {
      ;(async () => {
         if (!clerk.loaded || hasRun.current) return
         // Prevent re-running during session activation re-renders
         hasRun.current = true

         // Returning Google user — sign-in is complete
         if (signIn.status === 'complete') {
            await finalizeSignIn()
            return
         }

         // Google account already exists as a Clerk user — transfer sign-up to sign-in
         if (signUp.isTransferable) {
            await signIn.create({ transfer: true })
            const signInStatus = signIn.status as typeof signIn.status | 'complete'
            if (signInStatus === 'complete') {
               await finalizeSignIn()
               return
            }
            router.push('/sign-in')
            return
         }

         // New Google user — transfer sign-in attempt to a sign-up
         if (signIn.isTransferable) {
            await signUp.create({ transfer: true })
            if (signUp.status === 'complete') {
               await finalizeSignUp()
               return
            }
            router.push('/sign-in')
            return
         }

         // New Google sign-up is complete
         if (signUp.status === 'complete') {
            await finalizeSignUp()
            return
         }

         // User already has an active session on this client — activate it directly
         if (signIn.existingSession || signUp.existingSession) {
            const sessionId = signIn.existingSession?.sessionId || signUp.existingSession?.sessionId
            if (sessionId) {
               await clerk.setActive({
                  session: sessionId,
                  navigate: async () => {
                     router.push('/')
                  },
               })
            }
         }
      })()
   }, [clerk, signIn, signUp])

   return (
      <div>
         {/* Render captcha in case a sign-in is transferred to a sign-up */}
         <AuthRedirectionLoader text='Signing you in...' />
         <div id="clerk-captcha" />
      </div>
   )
}