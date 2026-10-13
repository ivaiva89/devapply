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
  usePathname: () => "/sign-up/timezone",
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

interface PageModule {
  default: (props: {
    params: Promise<Record<string, never>>;
    searchParams: Promise<Record<string, string | undefined>>;
  }) => Promise<ReactNode> | ReactNode;
}

async function loadPage(): Promise<PageModule> {
  const specifier = "./page";
  return (await import(/* @vite-ignore */ specifier)) as PageModule;
}

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

// Where the page redirected to, or null when it rendered.
async function redirectedTo(
  run: () => Promise<unknown>,
): Promise<string | null> {
  try {
    await run();
    return null;
  } catch (error) {
    const digest = (error as { digest?: unknown }).digest;
    if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT;")) {
      return digest.split(";").slice(2, -2).join(";");
    }
    throw error;
  }
}

function texts(document: Document, selector: string): string[] {
  return Array.from(document.querySelectorAll(selector)).map(
    (node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "",
  );
}

function props(returnTo?: string) {
  return {
    params: Promise.resolve({}),
    searchParams: Promise.resolve(returnTo === undefined ? {} : { returnTo }),
  };
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

async function storedTimezone(email: string): Promise<string | null> {
  const { rows } = await database.pg.query<{ timezone: string | null }>(
    `select timezone from "user" where email = $1`,
    [email],
  );
  return rows[0]?.timezone ?? null;
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
  it("story-accounts-timezone-settings-ac-15 (confirm step): `/sign-up/timezone` carries the confirm step's heading, label, helper line and buttons word for word. [bb-sign-in-7]", async () => {
    // [bb-sign-in-7]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    const { default: Page } = await loadPage();

    const page = await documentOf(await Page(props("/settings")));

    expect(texts(page, "h1")).toEqual(["Confirm your timezone"]);
    expect(texts(page, "p")).toContain(
      "Your browser reports UTC. Every date in DevApply is shown in the timezone you pick here, and you can change it later in Settings.",
    );
    const label = texts(page, "label")[0] ?? "";
    expect(label.startsWith("Timezone")).toBe(true);
    expect(texts(page, "button")).toEqual(
      expect.arrayContaining(["Continue", "Keep UTC"]),
    );
    expect(page.querySelector("select")).not.toBeNull();
  });

  it("story-accounts-timezone-settings-ac-5 (already set): An account that already has a timezone is returned to the return path, or to `/` when the path is missing or leaves the site, with nothing saved. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    incoming.cookie = await signedInAccount("dev@example.com", "Asia/Tokyo");
    const { default: Page } = await loadPage();

    expect(await redirectedTo(async () => Page(props("/settings?tab=1")))).toBe(
      "/settings?tab=1",
    );
    expect(await redirectedTo(async () => Page(props()))).toBe("/");
    expect(
      await redirectedTo(async () => Page(props("https://evil.example/x"))),
    ).toBe("/");
    expect(await storedTimezone("dev@example.com")).toBe("Asia/Tokyo");
  });

  it("story-accounts-timezone-settings-ac-6 (confirm page): A confirmed `UTC` is not changed by opening the confirm step; the account is sent on. [new]", async () => {
    // [new]
    incoming.cookie = await signedInAccount("dev@example.com", "UTC");
    const { default: Page } = await loadPage();

    expect(await redirectedTo(async () => Page(props("/settings")))).toBe(
      "/settings",
    );
    expect(await storedTimezone("dev@example.com")).toBe("UTC");
  });

  it("story-accounts-timezone-settings-ac-5 (no timezone yet): An account with no timezone is shown the step, and opening it saves nothing. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    const { default: Page } = await loadPage();

    const page = await documentOf(await Page(props("/settings")));

    expect(texts(page, "button")).toContain("Keep UTC");
    expect(await storedTimezone("dev@example.com")).toBeNull();
  });
});
