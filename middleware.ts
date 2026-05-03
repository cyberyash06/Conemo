import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middleware/authMiddleware';
import rateLimit from './middleware/rateLimiter';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function middleware(req: NextRequest) {
  // Apply Rate Limiter to guest auth route
  if (req.nextUrl.pathname === '/api/auth/guest') {
    // Determine user IP (works in simple setups and Vercel)
    const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
    try {
      // Limit to 5 requests per minute per IP
      await limiter.check(5, ip);
    } catch {
      return new NextResponse(JSON.stringify({
        success: false,
        message: 'Too many requests, please try again later.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Delegate to our structured auth middleware logic
  return authMiddleware(req);
}

export const config = {
  // Run middleware on all paths except static files, api routes (unless specified), Next.js internals
  matcher: [
    '/chat',
    '/dashboard',
    '/api/auth/guest'
  ],
};
