import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
   '/',
   '/about',
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

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, req) => {
   const { isAuthenticated, sessionClaims } = await auth();

   // Redirect to home page if user is already authenticated and is on auth page
   if (isAuthenticated && isAuthRoute(req)) {
      return NextResponse.redirect(new URL('/', req.url));
   };

   // Protect all routes except public routes
   if (!isPublicRoute(req)) {
      await auth.protect();
   }

   // Don't try to redirect users who are already on onboarding route
   if (isOnboardingRoute(req) && isAuthenticated) {
      return NextResponse.next();
   }

   // Authenticated but onboarding is not complete
   if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete && !req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
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