import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    const isAdmin = Boolean(request.cookies.get("admin-auth-token"));
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin-auth/login", request.url));
    }
  }

  // User-only routes protection
  const userProtectedRoutes = ["/cart", "/account"];
  if (userProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const isUser = Boolean(request.cookies.get("user-auth-token"));
    if (!isUser) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/account/:path*"],
};
