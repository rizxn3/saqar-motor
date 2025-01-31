import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /admin)
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register'

  // Get the token from the cookies
  const token = request.cookies.get('authToken')?.value

  // Redirect unauthenticated users to login page if trying to access protected routes
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from login/register pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin route protection
  if (path.startsWith('/admin')) {
    // Get user role from token or another cookie
    const userRole = request.cookies.get('userRole')?.value

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\..*$).*)',
  ],
}