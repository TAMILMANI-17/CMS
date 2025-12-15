import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken');

  // Public routes
  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If accessing a protected route without token, redirect to login
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing login/signup with token, redirect to dashboard
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

