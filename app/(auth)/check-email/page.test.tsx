import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// sign-up form, Better Auth's browser client and the page run for real.
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
  usePathname: () => "/check-email",
}));

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

// What the browser's Intl answers when asked for its time zone. Restores
// first, so a second call stubs the original and not the stub.
function browserReports(zone: string): void {
  vi.restoreAllMocks();
  const actual = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...actual.call(this), timeZone: zone };
    },
  );
}

beforeEach(() => {
  // A browser in a real zone, so the sign-up goes straight through on a
  // machine in UTC too; UTC would show the timezone step first.
  browserReports("Europe/Berlin");
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("page", () => {
  it("story-accounts-email-sign-up-ac-6: Pressing Resend on `/check-email` sends a new confirmation email. [bb-sign-in-8]", async () => {
    // [bb-sign-in-8]
    fetchMock.mockImplementation(async (input: unknown) =>
      /send-verification-email/.test(requestUrl(input))
        ? json({ status: true })
        : json({
            token: null,
            user: {
              id: "user-1",
              email: EMAIL,
              name: "dev",
              image: null,
              emailVerified: false,
              createdAt: "2026-10-09T12:00:00.000Z",
              updatedAt: "2026-10-09T12:00:00.000Z",
            },
          }),
    );
    const user = userEvent.setup();

    // Land on /check-email the way a visitor does: by signing up.
    const { SignUpForm } = await import("@/features/auth/ui/sign-up-form");
    const signUp = render(<SignUpForm />);
    await user.type(screen.getByLabelText(/^email/i), EMAIL);
    await user.type(screen.getByLabelText(/^password/i), PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() =>
      expect(nav.push.mock.calls.length + nav.replace.mock.calls.length).toBe(
        1,
      ),
    );
    const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0][0];
    const landing = new URL(target as string, "http://localhost:3000");
    signUp.unmount();

    nav.search = landing.search;
    const { default: CheckEmailPage } = await import("./page");
    const props = {
      params: Promise.resolve({}),
      searchParams: Promise.resolve(Object.fromEntries(landing.searchParams)),
    };
    render(await CheckEmailPage(props));
    expect(requestsTo(/send-verification-email/)).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: /^resend/i }));

    await waitFor(() =>
      expect(requestsTo(/send-verification-email/)).toHaveLength(1),
    );
    const [, init] = requestsTo(/send-verification-email/)[0];
    expect((init as RequestInit).method).toBe("POST");
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      email: EMAIL,
    });
  });
});
