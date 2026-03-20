import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 1. Define Public vs. Protected paths
  const isPublicPath = path === '/auth/login' || path === '/auth/signup'
  // Match the exact folder structure you are using
  const isProtectedPath = path === '/' || path.startsWith('/auth/settings')

  // 2. Check for ANY valid session (Google or Local Demo)
  // We check for 'next-auth.session-token' (Standard) or 'currentUser' (Our demo cookie)
  const token = request.cookies.get('next-auth.session-token')?.value || 
                request.cookies.get('currentUser')?.value

  // 3. LOGIC: If user is logged in and tries to go to Login/Signup, send them HOME
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // 4. LOGIC: If user is NOT logged in and tries to access Protected areas, send to LOGIN
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.nextUrl))
  }

  return NextResponse.next()
}

// 5. MATCHER: Ensure these paths are processed by the middleware
export const config = {
  matcher: [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/settings/:path*', // ✅ Protects settings and any sub-pages
  ],
}