// @vitest-environment node
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

// The external boundaries are the database, the mail provider and the
// framework's view of the incoming request and its cache. Better Auth runs for
// real on the Drizzle adapter, so the user rows are in the same Postgres the
// action writes to.
const sendEmail = vi.hoisted(() => vi.fn());
const incoming = vi.hoisted(() => ({ cookie: "" }));
const database = await vi.hoisted(async () => {
  const { startDatabase } = await import("@/shared/testing/auth-harness");
  return startDatabase();
});

vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: database.db }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  updateTag: vi.fn(),
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
  usePathname: () => "/settings",
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

// The page's markup as a document, with every server component below it
// resolved. The framework's real redirect surfaces as a thrown error.
async function documentOf(node: ReactNode): Promise<Document> {
  const { prelude } = await prerender(node);
  const html = await new Response(prelude).text();
  // Loaded by name: the package ships no type declarations.
  const specifier = "jsdom";
  const { JSDOM } = (await import(/* @vite-ignore */ specifier)) as JsdomModule;
  return new JSDOM(html).window.document;
}

function texts(document: Document, selector: string): string[] {
  return Array.from(document.querySelectorAll(selector)).map(
    (node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
}

interface PageModule {
  default: () => Promise<ReactNode> | ReactNode;
}

interface LayoutModule {
  default: (props: { children: ReactNode }) => Promise<ReactNode> | ReactNode;
}

async function loadPage(): Promise<PageModule> {
  const specifier = "./page";
  return (await import(/* @vite-ignore */ specifier)) as PageModule;
}

// The `(app)` group's layout, which every page in the group sits inside.
async function loadLayout(): Promise<LayoutModule> {
  const specifier = "../layout";
  return (await import(/* @vite-ignore */ specifier)) as LayoutModule;
}

// Settings as the visitor gets it: the page inside the group's layout.
async function settings(): Promise<Document> {
  const { default: Layout } = await loadLayout();
  const { default: Page } = await loadPage();
  return documentOf(await Layout({ children: await Page() }));
}

let nextAddress = 0;

// A confirmed account, signed in, with the timezone it was given (none for
// null). Returns the Cookie header of that device.
async function signedInAccount(
  email: string,
  timezone: string | null,
): Promise<string> {
  const auth = await loadAuth();
  await createConfirmedUser(auth, sendEmail, email);
  if (timezone !== null) {
    await database.pg.query(
      `update "user" set timezone = $1 where email = $2`,
      [timezone, email],
    );
  }
  nextAddress += 1;
  const response = await signInFrom(
    auth,
    email,
    PASSWORD,
    `198.51.100.${nextAddress}`,
  );
  expect(response.status).toBe(200);
  return cookieOf(response);
}

beforeEach(async () => {
  vi.resetModules();
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  incoming.cookie = "";
  await emptyDatabase(database.pg);
  await database.pg.exec(`truncate table "user" cascade`);

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
  it("story-accounts-timezone-settings-ac-8 (page): Settings shows the account's timezone, `UTC` included. [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]", async () => {
    // [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]
    for (const [n, timezone] of ["Europe/Berlin", "UTC"].entries()) {
      incoming.cookie = await signedInAccount(`dev${n}@example.com`, timezone);

      const page = await settings();

      expect(page.querySelector("select")?.value, timezone).toBe(timezone);
    }
  });

  it("story-accounts-timezone-settings-ac-12 (settings in the shell): Settings renders inside the app shell: the sidebar and the main area. [bb-sign-in-22]", async () => {
    // [bb-sign-in-22]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");

    const page = await settings();

    const main = page.querySelector("main");
    const nav = page.querySelector("nav");
    expect(page.querySelectorAll("main"), "one main area").toHaveLength(1);
    expect(main, "a main area").not.toBeNull();
    expect(nav, "a sidebar").not.toBeNull();
    expect(main?.contains(nav ?? null)).toBe(false);
    expect(nav?.querySelector('a[href="/settings"]')?.textContent?.trim()).toBe(
      "Settings",
    );
    expect(main?.querySelector("h1")?.textContent?.trim()).toBe("Settings");
  });

  it("story-accounts-timezone-settings-ac-14 (settings read): Settings reads the session's account only: each account sees its own timezone. [bb-sign-in-16]", async () => {
    // [bb-sign-in-16]
    const mine = await signedInAccount("mine@example.com", "Europe/Berlin");
    const theirs = await signedInAccount("theirs@example.com", "Asia/Tokyo");

    incoming.cookie = mine;
    expect((await settings()).querySelector("select")?.value).toBe(
      "Europe/Berlin",
    );

    incoming.cookie = theirs;
    expect((await settings()).querySelector("select")?.value).toBe(
      "Asia/Tokyo",
    );
  });

  it("story-accounts-timezone-settings-ac-15 (settings): `/settings` carries the headings, label, helper line and buttons the design lists for the timezone section and Sign out, word for word. [bb-sign-in-13]", async () => {
    // [bb-sign-in-13]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");

    const page = await settings();

    expect(texts(page, "h1")).toEqual(["Settings"]);
    expect(texts(page, "h2")).toEqual(["Timezone", "Account"]);
    expect(texts(page, "p")).toContain(
      "Every date in DevApply is shown in this timezone. Changing it doesn't change any stored time.",
    );
    expect((texts(page, "label")[0] ?? "").startsWith("Timezone")).toBe(true);
    expect(texts(page, "button")).toEqual(
      expect.arrayContaining(["Save", "Sign out"]),
    );
  });
});
