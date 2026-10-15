import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router, the network and the
// server-only marker. The page, its form, the step and Better Auth's browser
// client run for real.
const nav = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));
const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/sign-up",
}));

const EMAIL = "dev@example.com";
const PASSWORD = "correct-horse-battery";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// What the browser's Intl answers when asked for its time zone.
function browserReports(zone: string | undefined): void {
  vi.restoreAllMocks();
  const actual = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...actual.call(this), timeZone: zone as string };
    },
  );
}

beforeEach(() => {
  browserReports("UTC");
  nav.push.mockReset();
  nav.replace.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);

  // What the server side needs to load; no social provider is configured.
  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv(
    "DATABASE_URL_UNPOOLED",
    "postgresql://user:pass@localhost:5432/db",
  );
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-0000");
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  vi.stubEnv("EMAIL_FROM", "DevApply <no-reply@devapply.test>");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("page", () => {
  it("story-accounts-timezone-settings-ac-19: While the email sign-up's timezone step is shown, the page has one h1, and once the step is gone after a refused sign-up, the heading, the intro and the sign-in line are back. (regression pin) [F-accounts-28] [bb-sign-in-7]", async () => {
    // [F-accounts-28] [bb-sign-in-7]
    fetchMock.mockImplementation(async () =>
      json(
        {
          code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
          message: "User already exists. Use another email.",
        },
        422,
      ),
    );
    const { default: SignUpPage } = await import("./page");
    const user = userEvent.setup();
    const { container } = render(await SignUpPage());

    // The form as it opens: the page's heading, intro and sign-in line.
    expect(
      screen.getByRole("heading", { level: 1, name: "Create your account" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/^Track every application and interview round/),
    ).toBeInTheDocument();
    expect(screen.getByText(/^Already have an account\?/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^email/i), EMAIL);
    await user.type(screen.getByLabelText(/^password/i), PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    // The step stands alone: one h1, and none of the page's own lines.
    await screen.findByRole("heading", { name: "Confirm your timezone" });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(screen.queryByText("Create your account")).toBeNull();
    expect(
      screen.queryByText(/^Track every application and interview round/),
    ).toBeNull();
    expect(screen.queryByText(/^Already have an account\?/)).toBeNull();

    // The server refuses the sign-up: the step goes, and the page is back.
    await user.click(screen.getByRole("button", { name: "Keep UTC" }));

    await screen.findByRole("heading", {
      level: 1,
      name: "Create your account",
    });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(
      screen.getByText(/^Track every application and interview round/),
    ).toBeInTheDocument();
    const signInLine = screen.getByText(/^Already have an account\?/);
    expect(
      within(signInLine).getByRole("link", { name: "Sign in" }),
    ).toHaveAttribute("href", "/sign-in");
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Confirm your timezone" }),
      ).toBeNull(),
    );
    expect(nav.push).not.toHaveBeenCalled();
  });
});
