import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
   '/',
   '/explore',
   '/pricing',
   '/contact',
   '/sign-in(.*)',
   '/sign-up(.*)',
   '/forgot-password(.*)',
   '/sso-callback(.*)',
   '/api(.*)'
]);

const isAuthRoute = createRouteMatcher([
   '/sign-in(.*)',
   '/sign-up(.*)',
   '/forgot-password(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
   const { userId } = await auth();

   if (userId && isAuthRoute(req)) {
      return NextResponse.redirect(new URL('/', req.url));
   };

   if (!isPublicRoute(req)) {
      await auth.protect();
   }
});

export const config = {
   matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
      // Always run for Clerk-specific frontend API routes
      '/__clerk/(.*)',
   ],
};