import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/applications",
  "/pipeline",
  "/resumes",
  "/reminders",
  "/settings",
];

const SESSION_COOKIE_NAME = "devapply_session";

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (protectedPath) =>
      pathname === protectedPath || pathname.startsWith(`${protectedPath}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname === "/sign-in" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedPath(pathname) && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/applications/:path*", "/pipeline/:path*", "/resumes/:path*", "/reminders/:path*", "/settings/:path*", "/sign-in"],
};
