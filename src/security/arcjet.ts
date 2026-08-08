import arcjet, { ArcjetNextRequest, tokenBucket } from '@arcjet/next';

interface CreateRateLimiterProps {
   refillRate: number;
   interval: number;
   capacity: number;
}

export function createRateLimiter({ refillRate, interval, capacity }: CreateRateLimiterProps) {
   return arcjet({
      key: process.env.ARCJET_KEY!,
      characteristics: ['userId'],
      rules: [
         tokenBucket({
            mode: 'LIVE',
            refillRate,
            interval,
            capacity
         })
      ]
   });
}

export async function checkRateLimit(aj: ReturnType<typeof createRateLimiter>, req: ArcjetNextRequest, userId: string) {
   const decision = await aj.protect(req, { userId, requested: 1 });

   if (decision.isDenied()) {
      return decision.reason.isRateLimit() ? "Too many requests. Please try again later." : "Request blocked.";
   }

   return null;
}