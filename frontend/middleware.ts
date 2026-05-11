import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/analytics', '/ledger', '/settings'];
const authRoutes = ['/login', '/signup'];
const publicRoutes = ['/', '/login', '/signup', '/onboarding'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Public routes - always allow
  if (publicRoutes.includes(pathname)) {
    // If logged in and trying to access auth pages, redirect to dashboard
    if (accessToken && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|public|.*\\..*).*)'],
};
