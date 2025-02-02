import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/utils';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Admin path protection
  if (path.startsWith('/admin')) {
    const isAdmin = request.cookies.get('isAdmin')?.value === 'true';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Regular user path protection
  if (path.startsWith('/dashboard')) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};