import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes protection
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-auth")) {
    const token = request.cookies.get("accessToken");
    const isAuthenticated = Boolean(token);

    console.log(
      `[Middleware] Admin check on '${pathname}'. Token found: ${!!token}. Redirecting: ${!isAuthenticated}`
    );

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin-auth/login", request.url));
    }
    
    // Note: We'll need to check admin privileges in the admin layout or components
    // since middleware can't make API calls to verify user roles
  }

  // User-only routes protection
  const userProtectedRoutes = ["/cart", "/account"];
  if (userProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const isUser = Boolean(request.cookies.get("accessToken"));
    if (!isUser) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/cart", "/account/:path*"],
};
