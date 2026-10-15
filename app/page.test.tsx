// @vitest-environment node
import { NextRequest } from "next/server";
import type { ReactNode } from "react";
import { prerender } from "react-dom/static";
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
// typed arrays. The page is a server component, so its markup is what counts;
// it is rendered with every server component below it resolved.
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
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
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

interface JsdomModule {
  JSDOM: new (html: string) => { window: { document: Document } };
}

async function htmlOf(node: ReactNode): Promise<string> {
  const { prelude } = await prerender(node);
  return new Response(prelude).text();
}

async function documentOf(node: ReactNode): Promise<Document> {
  // Loaded by name: the package ships no type declarations.
  const specifier = "jsdom";
  const { JSDOM } = (await import(/* @vite-ignore */ specifier)) as JsdomModule;
  return new JSDOM(await htmlOf(node)).window.document;
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
    const html = await htmlOf(await RootPage());

    expect(html).toContain("dev@example.com");
  });

  it("story-accounts-timezone-settings-ac-12 (start page in the shell): The start page renders inside the app shell: the sidebar and the main area. [bb-sign-in-22]", async () => {
    // [bb-sign-in-22]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const signedIn = await signInFrom(
      auth,
      "dev@example.com",
      PASSWORD,
      "198.51.100.41",
    );
    expect(signedIn.status).toBe(200);
    incoming.cookie = cookieOf(signedIn);

    const { default: RootPage } = await import("./page");
    const page = await documentOf(await RootPage());

    const main = page.querySelector("main");
    const nav = page.querySelector("nav");
    expect(page.querySelectorAll("main"), "one main area").toHaveLength(1);
    expect(main, "a main area").not.toBeNull();
    expect(nav, "a sidebar").not.toBeNull();
    expect(main?.contains(nav ?? null)).toBe(false);
    expect(nav?.querySelector('a[href="/settings"]')?.textContent?.trim()).toBe(
      "Settings",
    );
    expect(main?.textContent).toContain("dev@example.com");
  });

  it("story-accounts-timezone-settings-ac-13: `/` still sends a signed-out visitor to `/sign-in` with the return path, and shows a signed-in one the start page. (regression pin) [F-accounts-12]", async () => {
    // [F-accounts-12]
    const { default: RootPage } = await import("./page");

    // Signed out: the page itself sends the visitor to sign-in, and the proxy
    // in front of it carries `/` along as the way back.
    let digest: unknown;
    try {
      await RootPage();
    } catch (error) {
      digest = (error as { digest?: unknown }).digest;
    }
    expect(String(digest)).toMatch(/^NEXT_REDIRECT;[a-z]+;\/sign-in;/);

    const { proxy } = await import("@/proxy");
    const sentAway = proxy(new NextRequest("http://localhost:3000/"));
    const location = new URL(
      sentAway.headers.get("location") ?? "",
      "http://localhost:3000",
    );
    expect(location.pathname).toBe("/sign-in");
    expect(location.searchParams.get("returnTo")).toBe("/");

    // Signed in: the start page, which names the visitor.
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const signedIn = await signInFrom(
      auth,
      "dev@example.com",
      PASSWORD,
      "198.51.100.42",
    );
    expect(signedIn.status).toBe(200);
    incoming.cookie = cookieOf(signedIn);

    expect(await htmlOf(await RootPage())).toContain("dev@example.com");
  });
});
