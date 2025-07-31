import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the admin session cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  let isLoggedIn = false;
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      isLoggedIn = session.loggedIn === true;
    } catch (error) {
      // Invalid JSON in cookie
      isLoggedIn = false;
    }
  }
  
  const isLoginPage = pathname === '/admin/login';

  // If trying to access any /admin/* route other than /admin/login
  if (pathname.startsWith('/admin/') && !isLoginPage) {
    if (!isLoggedIn) {
      // If not logged in, redirect to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If logged in and trying to access the login page
  if (isLoggedIn && isLoginPage) {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
