"use client"

import { Button } from '@/components/ui/button'
import { navigationData } from '@/data/navigation/navigation.data'
import { Show, UserButton } from '@clerk/nextjs'
import { BotMessageSquare, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useMediaQuery from '@/hooks/use-media-query'
import { authData } from '@/data/auth/auth.data'

interface NavbarProps {
   onMenuClick: () => void
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
   const pathname = usePathname();
   const mdWidth = useMediaQuery(767);

   return (
      <div className='fixed top-0 left-0 right-0 h-15 2xl:h-16 border-b border-violet-100/7 backdrop-blur-xl z-99999'>
         <div className="container h-full">
            <div className='flex items-center justify-between gap-4 h-full'>
               <div className='flex items-center gap-4'>
                  <Link href='/' className='flex items-center gap-1.5 text-violet-400'>
                     <BotMessageSquare className='mt-0.5 h-6.5 2xl:h-7 w-6.5 2xl:w-7' />
                     <h4 className='font-musemoderno font-bold text-xl 2xl:text-2xl'>evalo</h4>
                  </Link>
               </div>
               <div className="hidden md:flex items-center gap-10">
                  {
                     navigationData.map((item) => (
                        <Link
                           href={item.href}
                           key={item.href}
                           className={`hover:text-violet-400 font-medium text-sm 2xl:text-[15px] py-1 px-3 transition-colors ${pathname === item.href ? 'text-violet-400' : 'text-gray-100'}`}
                        >
                           {item.name}
                        </Link>
                     ))
                  }
               </div>
               <div className='flex items-center gap-2'>
                  <Show when="signed-out">
                     <Link href={authData.signUp.footer.linkUrl}>
                        <Button variant="ghost" size="lg">Sign In</Button>
                     </Link>
                     <Link href={authData.signIn.footer.linkUrl}>
                        <Button variant="white" size="lg">Get Started</Button>
                     </Link>
                  </Show>
                  <Show when="signed-in">
                     <UserButton />
                  </Show>
                  {!mdWidth && (
                     <button
                        onClick={onMenuClick}
                        className='p-2 hover:bg-zinc-800 rounded-lg transition-colors md:hidden'
                        aria-label="Toggle menu"
                     >
                        <Menu className='w-5 h-5 text-gray-100' />
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Navbar