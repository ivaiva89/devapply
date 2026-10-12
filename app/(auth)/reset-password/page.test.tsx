import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  emptyDatabase,
  ORIGIN,
  post,
  type AuthLike,
} from "@/shared/testing/auth-harness";

// The external boundaries are the framework's router, the network, and what
// the server side needs to run: its database (an in-memory Postgres that has
// run the repo's migrations, so the sign-in lockout has its table) and the
// mail provider. The page,
// its forms, Better Auth's browser client and Better Auth itself run for real;
// the browser's requests are handed to the real Better Auth instance, so what
// the page shows is what the server's token state says.
const nav = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  search: "",
}));
const fetchMock = vi.hoisted(() => vi.fn());
const sendEmail = vi.hoisted(() => vi.fn());
const database = await vi.hoisted(async () => {
  const { startDatabase: start } =
    await import("@/shared/testing/auth-harness");
  return start();
});
const store = vi.hoisted(() => ({
  user: [] as Record<string, unknown>[],
  session: [] as Record<string, unknown>[],
  account: [] as Record<string, unknown>[],
  verification: [] as Record<string, unknown>[],
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => "/reset-password",
}));
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

// The page is loaded when a test runs, so a build without it fails that test
// and leaves the suite loadable.
function load<T>(specifier: string): Promise<T> {
  return import(/* @vite-ignore */ specifier) as Promise<T>;
}

const EMAIL = "dev@example.com";
const NEW_PASSWORD = "a-brand-new-password-1";
const MINUTE = 60_000;

function requestUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return (input as Request).url;
}

// The browser's call to the password save: POST /api/auth/reset-password.
function saves() {
  return fetchMock.mock.calls.filter(
    ([input, init]) =>
      /\/api\/auth\/reset-password(\?|$)/.test(requestUrl(input)) &&
      (init as RequestInit | undefined)?.method === "POST",
  );
}

// The answers to the saves so far, once they have come back.
async function saveAnswers(): Promise<Response[]> {
  const pending = fetchMock.mock.calls
    .map((call, index) => ({ call, index }))
    .filter(
      ({ call: [input, init] }) =>
        /\/api\/auth\/reset-password(\?|$)/.test(requestUrl(input)) &&
        (init as RequestInit | undefined)?.method === "POST",
    )
    .map(
      ({ index }) => fetchMock.mock.results[index].value as Promise<Response>,
    );
  return Promise.all(pending);
}

// Every request the page's browser code makes reaches the real Better Auth.
let nextAddress = 0;
function routeFetchToAuth(auth: AuthLike): void {
  fetchMock.mockImplementation(
    async (input: unknown, init?: RequestInit): Promise<Response> => {
      nextAddress += 1;
      const headers = new Headers(init?.headers);
      if (!headers.has("origin")) headers.set("origin", ORIGIN);
      headers.set("x-forwarded-for", `198.51.100.${nextAddress}`);
      return auth.handler(
        new Request(new URL(requestUrl(input), ORIGIN), { ...init, headers }),
      );
    },
  );
}

// The link a person would click in the reset email: the one that opens
// /reset-password. HTML escapes the query separator, a mail client undoes it.
function emailedToken(): string {
  const payload = sendEmail.mock.calls.at(-1)?.[0] as
    { html?: string; text?: string } | undefined;
  const body = [payload?.html, payload?.text]
    .filter(Boolean)
    .join("\n")
    .replaceAll("&amp;", "&");
  const link = (body.match(/https?:\/\/[^\s"'<>)]+/g) ?? [])
    .map((href) => new URL(href))
    .find((url) => url.pathname === "/reset-password");
  const token = link?.searchParams.get("token");
  if (!token) throw new Error("no reset link was sent");
  return token;
}

async function loadAuth(): Promise<AuthLike> {
  const { auth } = await import("@/shared/lib/auth/server");
  return auth as unknown as AuthLike;
}

// A confirmed account that asked for a reset link: the token in its email.
// The account is a row in the database stand-in: signing up runs code that
// does not run in the browser-like environment this page is rendered in.
let nextResetAddress = 0;
async function requestedLink(auth: AuthLike): Promise<string> {
  const now = new Date();
  store.user.push({
    id: "user-1",
    email: EMAIL,
    name: "dev",
    emailVerified: true,
    image: null,
    createdAt: now,
    updatedAt: now,
  });
  // Each reset request comes from its own address: Better Auth's limiter
  // keys on it and outlives a test's module reset.
  nextResetAddress += 1;
  const response = await post(
    auth,
    "/request-password-reset",
    { email: EMAIL },
    `203.0.113.${nextResetAddress}`,
  );
  expect(response.status).toBe(200);
  return emailedToken();
}

// The page the way Next serves it for the emailed link; each test renders it,
// which is opening the link.
async function pageFor(token: string | undefined): Promise<ReactNode> {
  nav.search = token === undefined ? "" : `?token=${token}`;
  const { default: ResetPasswordPage } = await load<{
    default: (props: unknown) => Promise<ReactNode>;
  }>("./page");
  return ResetPasswordPage({
    params: Promise.resolve({}),
    searchParams: Promise.resolve(token === undefined ? {} : { token }),
  });
}

// A second link for the account that already asked for one: the token in the
// newest email.
async function anotherLink(auth: AuthLike): Promise<string> {
  nextResetAddress += 1;
  const response = await post(
    auth,
    "/request-password-reset",
    { email: EMAIL },
    `203.0.113.${nextResetAddress}`,
  );
  expect(response.status).toBe(200);
  return emailedToken();
}

async function saveNewPassword(
  user: ReturnType<typeof userEvent.setup>,
  password: string,
) {
  await user.type(screen.getByLabelText(/^new password/i), password);
  await user.click(screen.getByRole("button", { name: "Save new password" }));
}

// The expired screen: its heading, no way to save, and a way to ask again.
async function expectExpiredScreen() {
  expect(
    await screen.findByRole("heading", { name: "This link has expired" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Save new password" }),
  ).not.toBeInTheDocument();
  const resend = screen.getByText("Send a new link");
  expect(resend.closest("a, button")).not.toBeNull();
}

beforeEach(async () => {
  vi.resetModules();
  await emptyDatabase(database.pg);
  // Only the clock is faked: a link's age is a matter of dates.
  vi.useFakeTimers({ toFake: ["Date"] });
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  store.user.length = 0;
  store.session.length = 0;
  store.account.length = 0;
  store.verification.length = 0;

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

afterEach(() => {
  vi.useRealTimers();
});

describe("page", () => {
  it("story-accounts-password-reset-ac-3: Opening the reset link does not use it up; saving a new password on its page does. [F-accounts-8] [bb-sign-in-12]", async () => {
    // [F-accounts-8] [bb-sign-in-12]
    const auth = await loadAuth();
    const token = await requestedLink(auth);
    routeFetchToAuth(auth);
    const user = userEvent.setup();

    // Opening the link, twice over (a mail scanner, then the person): the page
    // offers the new-password form each time and saves nothing.
    const first = render(await pageFor(token));
    expect(
      await screen.findByRole("heading", { name: "Set a new password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save new password" }),
    ).toBeEnabled();
    first.unmount();
    render(await pageFor(token));
    expect(
      await screen.findByRole("button", { name: "Save new password" }),
    ).toBeEnabled();
    expect(saves()).toHaveLength(0);

    // Pressing the button saves the password, sending the link's token.
    await saveNewPassword(user, NEW_PASSWORD);

    await waitFor(() => expect(saves()).toHaveLength(1));
    const [, init] = saves()[0];
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      newPassword: NEW_PASSWORD,
      token,
    });

    // The server took the new password, and the link is used up: it refuses
    // the token a second time.
    const [saved] = await saveAnswers();
    expect(saved.status).toBe(200);
    const again = await post(auth, "/reset-password", {
      newPassword: "another-new-password-2",
      token,
    });
    expect(again.status).toBe(400);
  });

  it("story-accounts-password-reset-ac-4: A reset link used once shows the expired screen when opened again. [F-accounts-8]", async () => {
    // [F-accounts-8]
    const auth = await loadAuth();
    const token = await requestedLink(auth);
    routeFetchToAuth(auth);
    const user = userEvent.setup();
    const opened = render(await pageFor(token));
    await saveNewPassword(user, NEW_PASSWORD);
    await waitFor(() => expect(saves()).toHaveLength(1));
    const [saved] = await saveAnswers();
    expect(saved.status).toBe(200);
    opened.unmount();

    // Opening the same link again.
    render(await pageFor(token));

    await expectExpiredScreen();
  });

  it("story-accounts-password-reset-ac-5: A reset link older than one hour shows the expired screen with Send a new link. [F-accounts-9] [bb-sign-in-12]", async () => {
    // [F-accounts-9] [bb-sign-in-12]
    const auth = await loadAuth();
    const token = await requestedLink(auth);
    routeFetchToAuth(auth);

    // Fifty-nine minutes after it was sent, the link still opens the form.
    vi.setSystemTime(new Date(Date.now() + 59 * MINUTE));
    const withinTheHour = render(await pageFor(token));
    expect(
      await screen.findByRole("button", { name: "Save new password" }),
    ).toBeEnabled();
    withinTheHour.unmount();

    // Past the hour, it opens the expired screen instead.
    vi.setSystemTime(new Date(Date.now() + 2 * MINUTE));
    render(await pageFor(token));

    await expectExpiredScreen();
  });

  it("story-bug-build-fails-without-server-env-ac-2: `/reset-password` still shows the expired screen for a missing, used or expired token and the form for a usable one. [F-accounts-8] [F-accounts-9] (regression pin)", async () => {
    // [F-accounts-8] [F-accounts-9]
    const auth = await loadAuth();
    const usable = await requestedLink(auth);

    // A usable token: the new-password form.
    const form = render(await pageFor(usable));
    expect(
      await screen.findByRole("heading", { name: "Set a new password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save new password" }),
    ).toBeEnabled();
    form.unmount();

    // No token, and an empty one: the expired screen.
    for (const token of [undefined, ""]) {
      const missing = render(await pageFor(token));
      await expectExpiredScreen();
      missing.unmount();
    }

    // A token more than an hour old: the expired screen.
    vi.setSystemTime(new Date(Date.now() + 61 * MINUTE));
    const aged = render(await pageFor(usable));
    await expectExpiredScreen();
    aged.unmount();

    // A token the server has already taken a password with: the expired
    // screen. Asking again gives the account a new link.
    const toBeUsedUp = await anotherLink(auth);
    const saved = await post(auth, "/reset-password", {
      newPassword: NEW_PASSWORD,
      token: toBeUsedUp,
    });
    expect(saved.status).toBe(200);
    render(await pageFor(toBeUsedUp));
    await expectExpiredScreen();
  });
});
