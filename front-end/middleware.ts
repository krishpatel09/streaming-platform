import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if already in a regional path or is a static asset
  if (
    pathname.startsWith("/in/") ||
    pathname.startsWith("/us/") ||
    pathname.startsWith("/uk/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Detect country from headers (e.g., Cloudflare, Vercel)
  const country = request.headers.get("x-vercel-ip-country") || "in"; // default to 'in'
  const region = country.toLowerCase();

  // Redirect to /[region]/home if at root
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${region}/home`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
