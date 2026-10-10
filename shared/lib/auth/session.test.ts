// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cookieOf,
  createConfirmedUser,
  emptyDatabase,
  loadAuth,
  PASSWORD,
  signInFrom,
} from "@/shared/testing/auth-harness";

// The external boundaries are the database, the mail provider and the
// framework's view of the incoming request. Better Auth runs for real, with
// its own memory adapter and an in-memory Postgres behind the lockout.
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
// What a server component or action sees of the request that reached it.
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

async function signedInCookie(email: string): Promise<string> {
  const auth = await loadAuth();
  await createConfirmedUser(auth, sendEmail, email);
  const response = await signInFrom(auth, email, PASSWORD, "198.51.100.10");
  expect(response.status).toBe(200);
  return cookieOf(response);
}

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

describe("session", () => {
  it("story-accounts-sign-in-sessions-ac-6: `requireCurrentUser` refuses a server request that has no session. [bb-sign-in-15]", async () => {
    // [bb-sign-in-15]
    // Loaded when the test runs, so a tree without session.ts still
    // type-checks and builds while the test fails.
    const specifier = "./session";
    const { requireCurrentUser } = (await import(
      /* @vite-ignore */ specifier
    )) as { requireCurrentUser: () => Promise<unknown> };

    // No cookie at all.
    await expect(requireCurrentUser()).rejects.toThrow();

    // A session cookie the server never issued.
    incoming.cookie = "better-auth.session_token=forged.token";
    await expect(requireCurrentUser()).rejects.toThrow();

    // A person who signed in is not refused, so the refusal above is about
    // the missing session and nothing else.
    incoming.cookie = await signedInCookie("dev@example.com");
    const current = await requireCurrentUser();
    expect(JSON.stringify(current)).toContain("dev@example.com");
  });
});
