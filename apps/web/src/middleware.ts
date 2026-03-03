import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  
  // Protected routes that require authentication
  const protectedPaths = ["/", "/api/game", "/api/sync"];
  const isProtectedPath = protectedPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith("/api/game/") ||
      request.nextUrl.pathname.startsWith("/api/sync/")
  );

  if (isProtectedPath && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/api/game/:path*",
    "/api/sync/:path*",
  ],
};
