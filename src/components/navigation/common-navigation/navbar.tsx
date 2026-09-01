"use client";

import { Button } from '@/components/ui/button';
import { navigationData } from '@/data/navigation/navigation.data';
import { Show, UserButton, useUser } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useMediaQuery from '@/hooks/use-media-query';
import { authData } from '@/data/auth/auth.data';
import { useDbUser } from '@/hooks/use-db-user';
import Logo from '../../common/logo';

interface NavbarProps {
   onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
   const { isLoaded } = useUser();
   const { isLoading: isUserLoading } = useDbUser();

   const pathname = usePathname();
   const mdWidth = useMediaQuery(767);

   return (
      <div className='fixed top-0 left-0 right-0 h-15 2xl:h-16 border-b border-violet-100/7 backdrop-blur-xl z-999'>
         <div className="container h-full">
            <div className='flex items-center justify-between gap-4 h-full'>
               <div className='flex items-center gap-4'>
                  <Link href='/'>
                     <Logo containerClassName='scale-105 2xl:scale-115' />
                  </Link>
               </div>
               <div className="hidden md:flex items-center gap-6 lg:gap-10">
                  {
                     navigationData.map((item) => (
                        <Link
                           href={item.href}
                           key={item.href}
                           className={`hover:text-violet-400 font-medium text-sm 2xl:text-[15px] py-1 px-3 transition-colors ${pathname === item.href ? 'text-violet-400' : 'text-zinc-100'}`}
                        >
                           {item.name}
                        </Link>
                     ))
                  }
               </div>
               <div className='flex items-center gap-2'>
                  <div className="max-md:-mr-2">
                     <Show when="signed-out">
                        <Link href={authData.signUp.footer.linkUrl}>
                           <Button variant="ghost" size="lg">Sign In</Button>
                        </Link>
                        <Link href={authData.signIn.footer.linkUrl}>
                           <Button variant="white" size="lg">Get Started</Button>
                        </Link>
                     </Show>
                  </div>
                  <div className="flex items-center gap-2 mr-1 lg:mr-2">
                     {
                        isUserLoading ? <div className="h-8 w-25 rounded-sm bg-zinc-800 animate-pulse" /> : (
                           <Show when='signed-in'>
                              <Link href='/dashboard'>
                                 <Button variant="ghost" size="lg">Dashboard</Button>
                              </Link>
                           </Show>
                        )
                     }
                  </div>
                  {!isLoaded ? (
                     <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
                  ) : (
                     <Show when="signed-in">
                        <UserButton />
                     </Show>
                  )}
                  {mdWidth && (
                     <button
                        onClick={onMenuClick}
                        className='p-1.25 hover:bg-zinc-800 rounded-lg transition-colors md:hidden cursor-pointer'
                        aria-label="Toggle menu"
                     >
                        <Menu className='w-6 h-6 text-zinc-100' />
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Navbar;