// @vitest-environment node
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cookieOf,
  createConfirmedUser,
  emptyDatabase,
  loadAuth,
  ORIGIN,
  PASSWORD,
  signInFrom,
} from "@/shared/testing/auth-harness";

// The external boundaries are the database and the mail provider. Better
// Auth runs for real: it issues the session cookie the gate then reads.
const store = vi.hoisted(() => ({
  user: [] as Record<string, unknown>[],
  session: [] as Record<string, unknown>[],
  account: [] as Record<string, unknown>[],
  verification: [] as Record<string, unknown>[],
}));
const sendEmail = vi.hoisted(() => vi.fn());
const database = await vi.hoisted(async () => {
  const { startDatabase } = await import("@/shared/testing/auth-harness");
  return startDatabase();
});

vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: database.db }));
vi.mock("better-auth/adapters/drizzle", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return { drizzleAdapter: () => memoryAdapter(store) };
});
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));

interface ProxyModule {
  proxy?: (request: NextRequest) => Response | Promise<Response>;
  default?: (request: NextRequest) => Response | Promise<Response>;
  config?: { matcher?: string | string[] };
}

// Where a request for this path ends up: the address it is redirected to, or
// null when the app answers it as it is. A request counts only if Next would
// run the proxy for it, which the exported matcher decides.
async function redirectedTo(
  pathname: string,
  cookie?: string,
): Promise<URL | null> {
  // Loaded when the test runs, so a tree without proxy.ts still type-checks
  // and builds while the test fails.
  const specifier = "./proxy";
  const mod = (await import(/* @vite-ignore */ specifier)) as ProxyModule;
  const url = `${ORIGIN}${pathname}`;
  if (
    mod.config &&
    !unstable_doesMiddlewareMatch({
      config: mod.config,
      url,
      headers: cookie ? { cookie } : {},
    })
  ) {
    return null;
  }
  const handler = mod.proxy ?? mod.default;
  if (!handler) throw new Error("proxy.ts exports no proxy function");
  const response = await handler(
    new NextRequest(url, { headers: cookie ? { cookie } : {} }),
  );
  const location = response.headers.get("location");
  if (response.status < 300 || response.status >= 400 || !location) {
    return null;
  }
  return new URL(location, ORIGIN);
}

beforeEach(async () => {
  vi.resetModules();
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  store.user.length = 0;
  store.session.length = 0;
  store.account.length = 0;
  store.verification.length = 0;
  await emptyDatabase(database.pg);

  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv(
    "DATABASE_URL_UNPOOLED",
    "postgresql://user:pass@localhost:5432/db",
  );
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-0000");
  vi.stubEnv("BETTER_AUTH_URL", ORIGIN);
  vi.stubEnv("RESEND_API_KEY", "re_test_123");
  vi.stubEnv("EMAIL_FROM", "DevApply <no-reply@devapply.test>");
});

describe("proxy", () => {
  it("story-accounts-sign-in-sessions-ac-5: A signed-out visitor who opens an app route is sent to `/sign-in`, then returned to that route after signing in. [F-accounts-12] [bb-sign-in-14]", async () => {
    // [F-accounts-12] [bb-sign-in-14]
    // The settings page, signed out: sent to sign-in carrying the way back.
    const fromSettings = await redirectedTo("/settings");
    expect(fromSettings?.pathname).toBe("/sign-in");
    expect([...(fromSettings?.searchParams.values() ?? [])]).toContain(
      "/settings",
    );

    // The start page too.
    const fromStart = await redirectedTo("/");
    expect(fromStart?.pathname).toBe("/sign-in");

    // A signed-in visitor is let through to the same pages.
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const signedIn = await signInFrom(
      auth,
      "dev@example.com",
      PASSWORD,
      "198.51.100.30",
    );
    expect(signedIn.status).toBe(200);
    const cookie = cookieOf(signedIn);
    expect(await redirectedTo("/settings", cookie)).toBeNull();
    expect(await redirectedTo("/", cookie)).toBeNull();

    // Sign-in, sign-up and the auth API stay open, or the visitor could never
    // sign in; an address the app does not have stays a 404 for everyone.
    for (const open of [
      "/sign-in",
      "/sign-up",
      "/check-email",
      "/confirm-email",
      "/api/auth/get-session",
      "/no-such-page",
    ]) {
      expect(await redirectedTo(open), open).toBeNull();
    }
  });

  it("story-accounts-timezone-settings-ac-5 (session): `/sign-up/timezone` needs a session. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    // Signed out: sent to sign-in, carrying the confirm step as the way back.
    const signedOut = await redirectedTo("/sign-up/timezone");
    expect(signedOut?.pathname).toBe("/sign-in");
    expect([...(signedOut?.searchParams.values() ?? [])]).toContain(
      "/sign-up/timezone",
    );

    // Signed in: let through to the step.
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const signedIn = await signInFrom(
      auth,
      "dev@example.com",
      PASSWORD,
      "198.51.100.31",
    );
    expect(signedIn.status).toBe(200);
    expect(
      await redirectedTo("/sign-up/timezone", cookieOf(signedIn)),
    ).toBeNull();

    // The step's neighbour stays open: a visitor with no session still has to
    // be able to sign up.
    expect(await redirectedTo("/sign-up")).toBeNull();
  });
});
