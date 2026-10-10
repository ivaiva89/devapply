import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// The app routes. Every other address is left alone: the auth pages and the
// auth API have to stay open, and an address the app does not have is a 404
// for everyone.
export const config = {
  matcher: ["/", "/settings/:path*"],
};

// Sends a visitor with no session cookie to sign-in, carrying the route they
// asked for so the sign-in form can return them to it. The cookie is only
// looked for here, not verified: the pages verify it with requireCurrentUser.
export function proxy(request: NextRequest): NextResponse {
  if (getSessionCookie(request)) return NextResponse.next();

  const signIn = new URL("/sign-in", request.url);
  // The sign-in form reads the same parameter.
  signIn.searchParams.set(
    "returnTo",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(signIn);
}
