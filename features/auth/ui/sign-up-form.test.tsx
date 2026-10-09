import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// form, Better Auth's browser client and the pages run for real.
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

// What Better Auth answers a sign-up with while the email is unconfirmed.
function signedUp(email: string) {
  return json({
    token: null,
    user: {
      id: "user-1",
      email,
      name: email.split("@")[0],
      image: null,
      emailVerified: false,
      createdAt: "2026-10-09T12:00:00.000Z",
      updatedAt: "2026-10-09T12:00:00.000Z",
    },
  });
}

// The place the form sent the visitor, whichever router call it used.
function landedOn(): URL | undefined {
  const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0]?.[0];
  return typeof target === "string"
    ? new URL(target, "http://localhost:3000")
    : undefined;
}

// Everything on screen that a screen reader announces, with its text.
function announcements(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll(
      '[role="alert"], [aria-live="polite"], [aria-live="assertive"]',
    ),
  )
    .map((node) => node.textContent?.trim() ?? "")
    .filter((text) => text.length > 0);
}

async function fillIn(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(screen.getByLabelText(/^email/i), email);
  await user.type(screen.getByLabelText(/^password/i), password);
}

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("sign-up-form", () => {
  it("story-accounts-email-sign-up-ac-1: A visitor signs up at `/sign-up` with an email and a password and lands on `/check-email`, which names that address. [F-accounts-1] [bb-sign-in-1] [bb-sign-in-6] [bb-sign-in-8]", async () => {
    // [F-accounts-1] [bb-sign-in-1] [bb-sign-in-6] [bb-sign-in-8]
    fetchMock.mockImplementation(async () => signedUp(EMAIL));
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    const { unmount } = render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/check-email");
    const [signUp] = requestsTo(/sign-up/);
    const init = signUp[1] as RequestInit;
    expect(JSON.parse(init.body as string)).toMatchObject({
      email: EMAIL,
      password: PASSWORD,
    });

    // The page the visitor lands on, given the address the form passed on.
    unmount();
    const landing = landedOn() as URL;
    nav.search = landing.search;
    const { default: CheckEmailPage } =
      await import("@/app/(auth)/check-email/page");
    const props = {
      params: Promise.resolve({}),
      searchParams: Promise.resolve(Object.fromEntries(landing.searchParams)),
    };
    render(await CheckEmailPage(props));

    expect(
      screen.getByRole("heading", { name: "Check your email" }),
    ).toBeInTheDocument();
    expect(screen.getByText(EMAIL)).toBeInTheDocument();
  });

  it("story-accounts-email-sign-up-ac-2 (form): Signing up with an email that already has an account shows an error and creates nothing. [F-accounts-1]", async () => {
    // [F-accounts-1]
    fetchMock.mockImplementation(async () =>
      json(
        {
          code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
          message: "User already exists. Use another email.",
        },
        422,
      ),
    );
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    const { container } = render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(announcements(container)).not.toHaveLength(0));
    expect(landedOn()).toBeUndefined();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeEnabled();
  });

  it("story-accounts-email-sign-up-ac-9: The sign-up form is built on StackForm and shows field errors inline. [bb-sign-in-20]", async () => {
    // [bb-sign-in-20]
    fetchMock.mockImplementation(async () => signedUp(EMAIL));
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    const { container } = render(<SignUpForm />);
    const email = screen.getByLabelText(/^email/i);
    const password = screen.getByLabelText(/^password/i);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    // Each empty field says what is wrong next to itself, wired to the input
    // and announced; nothing was sent.
    await waitFor(() => expect(email).toHaveAttribute("aria-invalid", "true"));
    expect(password).toHaveAttribute("aria-invalid", "true");
    for (const input of [email, password]) {
      const message = document.getElementById(
        input.getAttribute("aria-describedby")?.split(" ")[0] ?? "",
      );
      expect(message?.textContent?.trim()).toBeTruthy();
      expect(message?.closest('[role="alert"], [aria-live]')).not.toBeNull();
    }
    expect(announcements(container).length).toBeGreaterThanOrEqual(2);
    expect(requestsTo(/sign-up/)).toHaveLength(0);

    // Filling the fields in clears the errors and lets the form go through.
    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(requestsTo(/sign-up/)).toHaveLength(1));
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(password).not.toHaveAttribute("aria-invalid", "true");
  });
});
