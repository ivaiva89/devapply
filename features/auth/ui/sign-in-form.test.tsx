import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router, the network, and what
// the server side needs to load: its database and the mail provider. The form,
// the page, Better Auth's browser client and the proxy that sends signed-out
// visitors here run for real.
const nav = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  search: "",
}));
const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => "/sign-in",
}));
vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: {} }));
vi.mock("better-auth/adapters/drizzle", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return {
    drizzleAdapter: () =>
      memoryAdapter({ user: [], session: [], account: [], verification: [] }),
  };
});
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

// The proxy and the page are loaded when a test runs, so a build where either
// is missing fails that test and leaves the suite loadable.
function load<T>(specifier: string): Promise<T> {
  return import(/* @vite-ignore */ specifier) as Promise<T>;
}

const ORIGIN = "http://localhost:3000";
const EMAIL = "dev@example.com";
const PASSWORD = "correct-horse-battery";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function requestUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return (input as Request).url;
}

function requestsTo(pattern: RegExp) {
  return fetchMock.mock.calls.filter(([input]) =>
    pattern.test(requestUrl(input)),
  );
}

// What Better Auth answers a correct email and password with.
function signedIn(email: string) {
  return json({
    redirect: false,
    token: "session-token",
    user: {
      id: "user-1",
      email,
      name: email.split("@")[0],
      image: null,
      emailVerified: true,
      createdAt: "2026-10-09T12:00:00.000Z",
      updatedAt: "2026-10-09T12:00:00.000Z",
    },
  });
}

// What Better Auth answers a wrong password, or an unknown email, with.
function rejected() {
  return json(
    { code: "INVALID_EMAIL_OR_PASSWORD", message: "Invalid email or password" },
    401,
  );
}

// The place the form sent the visitor, whichever router call it used.
function landedOn(): URL | undefined {
  const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0]?.[0];
  return typeof target === "string" ? new URL(target, ORIGIN) : undefined;
}

// The address the proxy sends a signed-out visitor to for this path: the
// sign-in page and the way back, exactly as the visitor's browser gets them.
async function signInAddressFor(pathname: string): Promise<URL> {
  const mod = await load<{
    proxy?: (request: NextRequest) => Response | Promise<Response>;
    default?: (request: NextRequest) => Response | Promise<Response>;
    config?: { matcher?: string | string[] };
  }>("../../../proxy");
  const url = `${ORIGIN}${pathname}`;
  if (mod.config) {
    expect(unstable_doesMiddlewareMatch({ config: mod.config, url })).toBe(
      true,
    );
  }
  const handler = mod.proxy ?? mod.default;
  if (!handler) throw new Error("proxy.ts exports no proxy function");
  const response = await handler(new NextRequest(url));
  return new URL(response.headers.get("location") ?? "", ORIGIN);
}

// The sign-in page the way Next serves it for an address.
async function renderSignInPage(address: URL) {
  nav.search = address.search;
  const { default: SignInPage } = await load<{
    default: (props: unknown) => Promise<React.ReactNode> | React.ReactNode;
  }>("../../../app/(auth)/sign-in/page");
  return render(
    await SignInPage({
      params: Promise.resolve({}),
      searchParams: Promise.resolve(Object.fromEntries(address.searchParams)),
    }),
  );
}

async function signInWith(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(screen.getByLabelText(/^email/i), email);
  await user.type(screen.getByLabelText(/^password/i), password);
  await user.click(screen.getByRole("button", { name: "Sign in" }));
}

beforeEach(() => {
  vi.resetModules();
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);

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

describe("sign-in-form", () => {
  it("story-accounts-sign-in-sessions-ac-1: A confirmed user signs in at `/sign-in` and lands on the page they asked for, or on the app's default route. [F-accounts-5] [bb-sign-in-10]", async () => {
    // [F-accounts-5] [bb-sign-in-10]
    fetchMock.mockImplementation(async () => signedIn(EMAIL));
    const user = userEvent.setup();
    await renderSignInPage(new URL("/sign-in", ORIGIN));

    await signInWith(user, EMAIL, PASSWORD);

    // The email and password went to Better Auth's password sign-in, and with
    // no page asked for, the visitor lands on the app's default route.
    await waitFor(() => expect(landedOn()).toBeDefined());
    const [signIn] = requestsTo(/sign-in\/email/);
    const init = signIn[1] as RequestInit;
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: EMAIL,
      password: PASSWORD,
    });
    expect(landedOn()?.origin).toBe(ORIGIN);
    expect(landedOn()?.pathname).toBe("/");
  });

  it('story-accounts-sign-in-sessions-ac-2: A wrong password shows "Wrong email or password." without saying which one was wrong. [F-accounts-5]', async () => {
    // [F-accounts-5]
    fetchMock.mockImplementation(async () => rejected());
    const user = userEvent.setup();
    await renderSignInPage(new URL("/sign-in", ORIGIN));
    const email = screen.getByLabelText(/^email/i);
    const password = screen.getByLabelText(/^password/i);

    await signInWith(user, EMAIL, "not-the-password");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/^Wrong email or password\.$/);
    // Neither field is singled out, and the visitor goes nowhere.
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(password).not.toHaveAttribute("aria-invalid", "true");
    expect(landedOn()).toBeUndefined();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
  });

  it("story-accounts-sign-in-sessions-ac-5 (form): A signed-out visitor who opens an app route is sent to `/sign-in`, then returned to that route after signing in. [F-accounts-12] [bb-sign-in-14]", async () => {
    // [F-accounts-12] [bb-sign-in-14]
    fetchMock.mockImplementation(async () => signedIn(EMAIL));
    const user = userEvent.setup();
    // The visitor opened /settings signed out: the proxy sent them here.
    const address = await signInAddressFor("/settings");
    expect(address.pathname).toBe("/sign-in");
    await renderSignInPage(address);

    await signInWith(user, EMAIL, PASSWORD);

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.origin).toBe(ORIGIN);
    expect(landedOn()?.pathname).toBe("/settings");
  });

  it("story-accounts-sign-in-sessions-ac-5 (off-site): A return path pointing off-site is ignored. [F-accounts-12] [bb-sign-in-14]", async () => {
    // [F-accounts-12] [bb-sign-in-14]
    const offSite = ["https://evil.example/phish", "//evil.example/phish"];
    for (const target of offSite) {
      nav.push.mockReset();
      nav.replace.mockReset();
      fetchMock.mockReset();
      fetchMock.mockImplementation(async () => signedIn(EMAIL));
      const user = userEvent.setup();

      // The address the proxy would send a visitor to, with the way back
      // swapped for a place outside the app.
      const address = await signInAddressFor("/settings");
      const wayBack = [...address.searchParams.entries()].find(
        ([, value]) => value === "/settings",
      );
      expect(
        wayBack,
        "the proxy carries the route in the address",
      ).toBeDefined();
      address.searchParams.set((wayBack as [string, string])[0], target);
      const { unmount } = await renderSignInPage(address);

      await signInWith(user, EMAIL, PASSWORD);

      await waitFor(() => expect(landedOn()).toBeDefined(), { timeout: 3000 });
      expect(landedOn()?.origin, target).toBe(ORIGIN);
      expect(landedOn()?.pathname, target).toBe("/");
      unmount();
    }
  });
});
