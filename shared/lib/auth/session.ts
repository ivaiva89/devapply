import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { auth } from "./server";

type CurrentUser = typeof auth.$Infer.Session.user;

// The signed-in user behind the request a server component or action is
// answering, or null. Better Auth checks the session cookie against the
// database.
export async function getCurrentUser(): Promise<CurrentUser | null> {
  // Read first: a page that reads the request is never rendered by
  // `next build`, which has no secrets for the auth instance to load with.
  const requestHeaders = await headers();
  const { auth } = await import("./server");
  const session = await auth.api.getSession({ headers: requestHeaders });
  return session?.user ?? null;
}

// For code that only a signed-in user may run: a request with no session is
// sent to sign-in and never reaches the caller's next line.
export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}
