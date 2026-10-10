// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cookieOf,
  createConfirmedUser,
  emptyDatabase,
  loadAuth,
  PASSWORD,
  signInFrom,
} from "@/shared/testing/auth-harness";

// Runs in Node, not jsdom: Better Auth's token signing refuses jsdom's
// typed arrays. The page is a server component, so its markup is what counts.
// The external boundaries are the database, the mail provider and the
// framework's view of the incoming request. Better Auth runs for real.
const store = vi.hoisted(() => ({
  user: [] as Record<string, unknown>[],
  session: [] as Record<string, unknown>[],
  account: [] as Record<string, unknown>[],
  verification: [] as Record<string, unknown>[],
}));
const sendEmail = vi.hoisted(() => vi.fn());
const incoming = vi.hoisted(() => ({ cookie: "" }));
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
vi.mock("next/headers", () => {
  const jar = () =>
    incoming.cookie
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const at = part.indexOf("=");
        return { name: part.slice(0, at), value: part.slice(at + 1) };
      });
  return {
    headers: async () =>
      new Headers(incoming.cookie ? { cookie: incoming.cookie } : {}),
    cookies: async () => ({
      get: (name: string) => jar().find((entry) => entry.name === name),
      getAll: () => jar(),
      has: (name: string) => jar().some((entry) => entry.name === name),
    }),
  };
});

beforeEach(async () => {
  vi.resetModules();
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  store.user.length = 0;
  store.session.length = 0;
  store.account.length = 0;
  store.verification.length = 0;
  incoming.cookie = "";
  await emptyDatabase(database.pg);

  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv(
    "DATABASE_URL_UNPOOLED",
    "postgresql://user:pass@localhost:5432/db",
  );
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-0000");
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  vi.stubEnv("RESEND_API_KEY", "re_test_123");
  vi.stubEnv("EMAIL_FROM", "DevApply <no-reply@devapply.test>");
});

describe("page", () => {
  it("story-accounts-sign-in-sessions-ac-1 (start page): A confirmed user signs in at `/sign-in` and lands on the page they asked for, or on the app's default route. [F-accounts-5] [bb-sign-in-10]", async () => {
    // [F-accounts-5] [bb-sign-in-10]
    // The default route is `/`. A signed-in visitor who lands there sees a
    // page that names them, not a redirect back to sign-in.
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const signedIn = await signInFrom(
      auth,
      "dev@example.com",
      PASSWORD,
      "198.51.100.40",
    );
    expect(signedIn.status).toBe(200);
    incoming.cookie = cookieOf(signedIn);

    const { default: RootPage } = await import("./page");
    const html = renderToStaticMarkup(await RootPage());

    expect(html).toContain("dev@example.com");
  });
});
