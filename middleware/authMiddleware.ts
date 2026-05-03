import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Protect these paths
const protectedPaths = ['/chat', '/dashboard'];

export async function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get('guest_token')?.value;

  if (!token) {
    // Redirect to landing page if no token
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    
    // Verify token using jose for Edge compatibility
    const { payload } = await jwtVerify(token, secretKey);
    
    // Append user info to request headers if needed downstream
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-username', payload.username as string);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid or expired token
    const url = req.nextUrl.clone();
    url.pathname = '/';
    
    const response = NextResponse.redirect(url);
    // Delete the invalid cookie
    response.cookies.delete('guest_token');
    return response;
  }
}
