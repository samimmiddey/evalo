// import arcjet, { detectBot, shield } from '@arcjet/next';
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

const roleRouteMap = [
   { matcher: createRouteMatcher(['/interviewers(.*)', '/appointments(.*)', '/call(.*)']), allowedRole: 'INTERVIEWEE' },
   { matcher: createRouteMatcher(['/dashboard(.*)', 'call(.*)']), allowedRole: 'INTERVIEWER' },
] as const;

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

// const aj = arcjet({
//    key: process.env.ARCJET_KEY!,
//    rules: [
//       shield({ mode: "LIVE" }),
//       detectBot({
//          mode: "LIVE",
//          allow: [
//             "CATEGORY:SEARCH_ENGINE",
//             "CATEGORY:PREVIEW"
//          ]
//       })
//    ]
// });

export default clerkMiddleware(async (auth, req) => {
   // Apply Arcjet protection
   // const decision = await aj.protect(req);

   // if (decision.isDenied()) {
   //    return NextResponse.json({ error: "Request blocked" }, { status: 403 });
   // }

   const { isAuthenticated, sessionClaims } = await auth();

   // Redirect to home page if user is already authenticated and is on auth page
   if (isAuthenticated && isAuthRoute(req)) {
      return NextResponse.redirect(new URL('/', req.url));
   };

   // Protect all routes except public routes
   if (!isPublicRoute(req) && !isAuthenticated) {
      const signInUrl = new URL('/sign-in', req.url);
      const currentPath = req.nextUrl.pathname + req.nextUrl.search;
      signInUrl.searchParams.set('redirect_url', currentPath);

      return NextResponse.redirect(signInUrl);
   }

   // Don't try to redirect users who are already on onboarding route
   if (isOnboardingRoute(req) && isAuthenticated) {
      return NextResponse.next();
   }

   // Authenticated but onboarding is not complete
   if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete && !req.nextUrl.pathname.startsWith('/api')) {
      const onboardingUrl = new URL('/onboarding', req.url);
      const existingRedirect = req.nextUrl.searchParams.get("redirect_url") ?? req.nextUrl.pathname + req.nextUrl.search;
      onboardingUrl.searchParams.set("redirect_url", existingRedirect);

      return NextResponse.redirect(onboardingUrl);
   }

   // Role-based route authorization
   if (isAuthenticated) {
      const role = sessionClaims?.metadata?.role;

      const matchedRule = roleRouteMap.find(({ matcher }) => matcher(req));

      if (matchedRule && matchedRule.allowedRole !== role) {
         const fallbackUrl = role === 'INTERVIEWER' ? '/dashboard' : '/interviewers';
         return NextResponse.redirect(new URL(fallbackUrl, req.url));
      }
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