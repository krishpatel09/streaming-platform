import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.get("is-auth")?.value === "true";

  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const authRoutes = ["/profile-selecter", "/mypage"];
  const isAuthRoute = pathname === "/login";

  if (authRoutes.some((route) => pathname.startsWith(route)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
