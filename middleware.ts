import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/utils';

export function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/admin'];
  const adminPaths = ['/admin'];

  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // Check if path requires protection
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = token ? verifyToken(token) : null;
    
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check admin routes
    if (adminPaths.some(prefix => path.startsWith(prefix)) && decoded.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};