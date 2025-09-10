// src/middleware.ts or middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const protectedRoutes = ["/dashboard", "/checkout", "/account", "/profile"];
const redirectIfLoggedInRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract cookies from the incoming request headers
  const cookieHeader = request.headers.get("cookie") || "";

  // Create Supabase client with cookie header for auth state
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session?.user;

  // Redirect unauthenticated users away from protected routes
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login/register pages
  if (
    redirectIfLoggedInRoutes.some((route) => pathname.startsWith(route)) &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/account/:path*",
    "/profile/:path*",
    "/login/:path*",
    "/register/:path*",
    "/success/:path*",
  ],
};
