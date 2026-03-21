import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define Paths
  const isPublicPath = path === "/auth/login" || path === "/auth/signup";
  const isProtectedPath = path === "/dashboard" || path.startsWith("/auth/settings");

  // 2. Check for NextAuth Token (Google)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 3. Check for Local Cookie (OTP Login)
  const localCookie = request.cookies.get("currentUser")?.value;

  // 4. Determine if the user is authenticated by EITHER method
  const isAuthenticated = !!token || !!localCookie;

  // Redirect Logic
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/auth/login",
    "/auth/signup",
    "/auth/settings/:path*",
  ],
};