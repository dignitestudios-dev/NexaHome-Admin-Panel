import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie name must match AUTH_TOKEN_KEY in src/lib/auth-session.ts
const TOKEN_COOKIE = "token";

const PROTECTED_PREFIX = "/app";
const AUTH_PREFIX = "/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isAuthRoute = pathname.startsWith(AUTH_PREFIX);

  // Not logged in → block /app/* and send to login.
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in → keep them out of auth pages.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API, Next internals, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|asset|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
};
