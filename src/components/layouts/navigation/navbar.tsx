"use client"

import { Button } from '@/components/ui/button'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { BotMessageSquare } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
   return (
      <div className='fixed top-0 left-0 right-0 h-15 2xl:h-16 border-b border-white/7 backdrop-blur-xl z-999999'>
         <div className="container h-full">
            <div className='flex items-center justify-between gap-4 h-full'>
               <Link href='/' className='flex items-center gap-1.5 text-violet-400'>
                  <BotMessageSquare className='mt-0.5 h-6.5 2xl:h-7 w-6.5 2xl:w-7' />
                  <h4 className='font-musemoderno font-bold text-xl 2xl:text-2xl'>evalo</h4>
               </Link>
               <div className='flex items-center gap-2'>
                  <Show when="signed-out">
                     <SignInButton>
                        <Button variant="ghost" size="lg">Sign In</Button>
                     </SignInButton>
                     <SignUpButton>
                        <Button variant="white" size="lg">Get Started</Button>
                     </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                     <UserButton />
                  </Show>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Navbar