import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const { valid } = await verifyAdminToken(sessionCookie);

  // 1. If accessing the login page
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    // If already authenticated, redirect directly to admin workspace
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Otherwise allow access to login page
    return NextResponse.next();
  }

  // 2. If accessing /admin or any nested admin route without a valid session
  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated session: proceed to admin workspace
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
