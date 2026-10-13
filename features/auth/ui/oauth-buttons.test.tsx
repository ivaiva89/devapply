import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// sign-in and sign-up pages, their forms, the buttons, the server code that
// says which providers are offered and Better Auth's browser client run for
// real; the environment is the only thing that decides what is offered.
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

const ORIGIN = "http://localhost:3000";

type Page = (props: unknown) => Promise<ReactNode> | ReactNode;

// The pages are loaded when a test runs, so a build where either is missing
// fails that test and leaves the suite loadable.
function load<T>(specifier: string): Promise<T> {
  return import(/* @vite-ignore */ specifier) as Promise<T>;
}

async function pageAt(path: "sign-in" | "sign-up"): Promise<Page> {
  const { default: page } = await load<{ default: Page }>(
    `../../../app/(auth)/${path}/page`,
  );
  return page;
}

// The page the way Next serves it for an address.
async function renderPage(path: "sign-in" | "sign-up", address?: URL) {
  const url = address ?? new URL(`/${path}`, ORIGIN);
  nav.search = url.search;
  const page = await pageAt(path);
  return render(
    await page({
      params: Promise.resolve({}),
      searchParams: Promise.resolve(Object.fromEntries(url.searchParams)),
    }),
  );
}

const REQUIRED_ENV = {
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db",
  DATABASE_URL_UNPOOLED: "postgresql://user:pass@localhost:5432/db",
  BETTER_AUTH_SECRET: "test-secret-test-secret-test-secret-0000",
  BETTER_AUTH_URL: ORIGIN,
  RESEND_API_KEY: "re_test_123",
  EMAIL_FROM: "DevApply <no-reply@devapply.test>",
} as const;

const GOOGLE_PAIR = {
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
} as const;
const GITHUB_PAIR = {
  GITHUB_CLIENT_ID: "github-client-id",
  GITHUB_CLIENT_SECRET: "github-client-secret",
} as const;
const OAUTH_NAMES = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
] as const;

// The server's environment for one request: the required variables, and only
// the OAuth values given.
function stubEnvironment(oauth: Record<string, string> = {}): void {
  for (const [name, value] of Object.entries(REQUIRED_ENV)) {
    vi.stubEnv(name, value);
  }
  for (const name of OAUTH_NAMES) vi.stubEnv(name, oauth[name]);
}

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

// What Better Auth answers a social sign-in request with. It is not asked to
// redirect: the browser leaving the page is not what these tests look at.
function socialSignInAnswer(provider: string): Response {
  return json({
    url: `https://${provider}.example/authorize?state=state-1`,
    redirect: false,
  });
}

interface SocialSignInRequest {
  provider: string;
  callbackURL: string;
  errorCallbackURL: string;
}

function socialSignIns(): SocialSignInRequest[] {
  return fetchMock.mock.calls
    .filter(([input]) => /\/sign-in\/social/.test(requestUrl(input)))
    .map(([, init]) => JSON.parse((init as RequestInit).body as string));
}

function button(provider: "Google" | "GitHub"): HTMLElement {
  return screen.getByRole("button", {
    name: new RegExp(`continue with ${provider}`, "i"),
  });
}

function hasButton(provider: "Google" | "GitHub"): boolean {
  return (
    screen.queryByRole("button", {
      name: new RegExp(`continue with ${provider}`, "i"),
    }) !== null
  );
}

function sha256(path: string): string {
  return createHash("sha256")
    .update(readFileSync(resolve(process.cwd(), path)))
    .digest("hex");
}

beforeEach(() => {
  vi.resetModules();
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  stubEnvironment();
});

describe("oauth-buttons", () => {
  it("story-accounts-social-sign-in-ac-5: A link is refused when the provider reports the email as unverified, and when the account's own email is not confirmed; either way the visitor returns to sign in with the message to use the existing method. [F-accounts-4] [F-accounts-22] [bb-sign-in-4]", async () => {
    // [F-accounts-4] [F-accounts-22] [bb-sign-in-4]
    // Better Auth sends a refused link back to the sign-in page with
    // `error=account_not_linked` (see the server test for that redirect).
    const refused = new URL("/sign-in", ORIGIN);
    refused.searchParams.set("error", "account_not_linked");

    await renderPage("sign-in", refused);

    expect(
      await screen.findByText(
        "An account with this email already exists. Sign in the way you did before.",
      ),
    ).toBeInTheDocument();
    // The visitor is on the sign-in page, with its form to use.
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();

    // A visitor who was not sent back from a refused link sees no such message.
    cleanup();
    await renderPage("sign-in");
    expect(
      screen.queryByText(/an account with this email already exists/i),
    ).not.toBeInTheDocument();
  });

  it("story-accounts-social-sign-in-ac-6: A provider's button is offered only where that provider's client id and secret are both set, each provider on its own pair. [bb-sign-in-21]", async () => {
    // [bb-sign-in-21]
    // `next build` runs with no environment: the pages still load.
    for (const name of Object.keys(REQUIRED_ENV)) vi.stubEnv(name, undefined);
    for (const name of OAUTH_NAMES) vi.stubEnv(name, undefined);
    await expect(pageAt("sign-in")).resolves.toBeTypeOf("function");
    await expect(pageAt("sign-up")).resolves.toBeTypeOf("function");

    const scenarios: {
      name: string;
      oauth: Record<string, string>;
      google: boolean;
      github: boolean;
    }[] = [
      {
        name: "both pairs set",
        oauth: { ...GOOGLE_PAIR, ...GITHUB_PAIR },
        google: true,
        github: true,
      },
      {
        name: "only the GitHub pair set",
        oauth: { ...GITHUB_PAIR },
        google: false,
        github: true,
      },
      {
        name: "only the Google pair set",
        oauth: { ...GOOGLE_PAIR },
        google: true,
        github: false,
      },
      {
        name: "Google id without its secret, GitHub pair set",
        oauth: {
          GOOGLE_CLIENT_ID: GOOGLE_PAIR.GOOGLE_CLIENT_ID,
          ...GITHUB_PAIR,
        },
        google: false,
        github: true,
      },
      {
        name: "GitHub secret without its id, Google pair set",
        oauth: {
          GITHUB_CLIENT_SECRET: GITHUB_PAIR.GITHUB_CLIENT_SECRET,
          ...GOOGLE_PAIR,
        },
        google: true,
        github: false,
      },
      { name: "neither pair set", oauth: {}, google: false, github: false },
    ];

    for (const path of ["sign-in", "sign-up"] as const) {
      for (const scenario of scenarios) {
        cleanup();
        vi.resetModules();
        stubEnvironment(scenario.oauth);

        await renderPage(path);

        const label = `${path}, ${scenario.name}`;
        expect(hasButton("Google"), `${label}: Google button`).toBe(
          scenario.google,
        );
        expect(hasButton("GitHub"), `${label}: GitHub button`).toBe(
          scenario.github,
        );
        // The email form is there whatever is offered.
        expect(
          screen.getByLabelText(/^email/i),
          `${label}: email field`,
        ).toBeInTheDocument();
      }
    }
  });

  it("story-accounts-social-sign-in-ac-7: The buttons carry each provider's official mark, the files in `public/brand/` being the providers' downloadable assets unchanged. [bb-sign-in-21]", async () => {
    // [bb-sign-in-21]
    // The staged official files, by SHA-256: Google's standalone G from
    // developers.google.com and GitHub's Invertocat (black) from
    // brand.github.com.
    expect(existsSync(resolve(process.cwd(), "public/brand/google.png"))).toBe(
      true,
    );
    expect(existsSync(resolve(process.cwd(), "public/brand/github.svg"))).toBe(
      true,
    );
    expect(sha256("public/brand/google.png")).toBe(
      "d1ce9c2af0b10a7333abc99bc706f9a6a199e5b65bf3e3009624f076b8638e6a",
    );
    expect(sha256("public/brand/github.svg")).toBe(
      "693d7abe6f899646cc2e96856723b45e95f71885a54910b2749f6decdf7e1ee1",
    );

    // Each button shows its own provider's file, beside the label.
    stubEnvironment({ ...GOOGLE_PAIR, ...GITHUB_PAIR });
    for (const path of ["sign-in", "sign-up"] as const) {
      cleanup();
      await renderPage(path);

      const googleMark = button("Google").querySelector("img");
      const githubMark = button("GitHub").querySelector("img");
      expect(googleMark, `${path}: Google mark`).not.toBeNull();
      expect(githubMark, `${path}: GitHub mark`).not.toBeNull();
      expect(
        decodeURIComponent(googleMark?.getAttribute("src") ?? ""),
      ).toContain("/brand/google.png");
      expect(
        decodeURIComponent(githubMark?.getAttribute("src") ?? ""),
      ).toContain("/brand/github.svg");
    }
  });

  it("story-accounts-social-sign-in-ac-8: A social sign-in that started from a protected route returns to that route, and otherwise lands on `/`. [F-accounts-12] [bb-sign-in-10]", async () => {
    // [F-accounts-12] [bb-sign-in-10]
    stubEnvironment({ ...GOOGLE_PAIR, ...GITHUB_PAIR });
    fetchMock.mockImplementation(async () => socialSignInAnswer("github"));

    // The visitor opened a protected route signed out; the proxy sent them to
    // /sign-in carrying it as `returnTo`.
    const protectedRoute = new URL("/sign-in", ORIGIN);
    protectedRoute.searchParams.set("returnTo", "/applications/42?tab=notes");
    const user = userEvent.setup();
    await renderPage("sign-in", protectedRoute);

    await user.click(button("GitHub"));

    await waitFor(() => expect(socialSignIns()).toHaveLength(1));
    const [fromRoute] = socialSignIns();
    expect(fromRoute.provider).toBe("github");
    const back = new URL(fromRoute.callbackURL, ORIGIN);
    expect(back.origin).toBe(ORIGIN);
    expect(back.pathname).toBe("/applications/42");
    expect(back.search).toBe("?tab=notes");
    // A sign-in that does not finish comes back to the sign-in page.
    expect(new URL(fromRoute.errorCallbackURL, ORIGIN).pathname).toBe(
      "/sign-in",
    );

    // Opened with no route asked for, or with one pointing off the site, the
    // visitor lands on `/`.
    const noRoute = [
      new URL("/sign-in", ORIGIN),
      (() => {
        const offSite = new URL("/sign-in", ORIGIN);
        offSite.searchParams.set("returnTo", "https://evil.example/phish");
        return offSite;
      })(),
    ];
    for (const address of noRoute) {
      cleanup();
      fetchMock.mockClear();
      await renderPage("sign-in", address);

      await user.click(button("Google"));

      await waitFor(() => expect(socialSignIns()).toHaveLength(1));
      const [landing] = socialSignIns();
      expect(landing.provider, address.href).toBe("google");
      const target = new URL(landing.callbackURL, ORIGIN);
      expect(target.origin, address.href).toBe(ORIGIN);
      expect(target.pathname, address.href).toBe("/");
    }

    // From sign-up there is no route to return to.
    cleanup();
    fetchMock.mockClear();
    await renderPage("sign-up");

    await user.click(button("GitHub"));

    await waitFor(() => expect(socialSignIns()).toHaveLength(1));
    const [fromSignUp] = socialSignIns();
    expect(fromSignUp.provider).toBe("github");
    expect(new URL(fromSignUp.callbackURL, ORIGIN).pathname).toBe("/");
  });
});
