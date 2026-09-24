import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const hasSession = !!sessionCookie?.value;

  // Protect private routes: Redirect to login if user is unauthenticated
  const privateRoutes = ['/', '/admin'];
  const isPrivateKeyPath = privateRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivateKeyPath && !hasSession) {
    // If the path is /admin/audit-logs or the root dashboard, redirect to /login
    const loginUrl = new URL('/login', request.url);
    const emailParam = request.nextUrl.searchParams.get('email');
    if (emailParam) {
      loginUrl.searchParams.set('email', emailParam);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages (login/signup) directly to home dashboard
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (BFF API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
