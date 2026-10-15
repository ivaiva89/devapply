import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

// The body of the one sign-up request the form sent.
function signUpBody(): Record<string, unknown> {
  const [signUp] = requestsTo(/sign-up/);
  return JSON.parse((signUp?.[1] as RequestInit).body as string) as Record<
    string,
    unknown
  >;
}

const REST_OF_STEP =
  "Every date in DevApply is shown in the timezone you pick here, and you can change it later in Settings.";

// The text with the typographic apostrophe written plain, so a message is
// held to its words and not to which apostrophe the page uses.
function plain(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/\u2019/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// The words under the step's heading.
function introduction(): string {
  return plain(
    screen.getByRole("heading", { level: 1 }).nextElementSibling?.textContent,
  );
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
  // A browser in a real zone, so a sign-up goes straight through; the tests
  // about the timezone step set the zone they need.
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

  it("story-accounts-timezone-settings-ac-1 (form): A sign-up from a browser that reports a valid zone other than UTC sends that zone with the form and goes on without a question. [F-accounts-13] [bb-sign-in-18] [bb-sign-in-33]", async () => {
    // [F-accounts-13] [bb-sign-in-18] [bb-sign-in-33]
    browserReports("Europe/Berlin");
    fetchMock.mockImplementation(async () => signedUp(EMAIL));
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/check-email");
    expect(requestsTo(/sign-up/)).toHaveLength(1);
    expect(signUpBody()).toMatchObject({
      email: EMAIL,
      timezone: "Europe/Berlin",
    });
    expect(
      screen.queryByRole("heading", { name: "Confirm your timezone" }),
    ).not.toBeInTheDocument();
  });

  it("story-accounts-timezone-settings-ac-2 (Keep UTC): A browser that reports UTC gets the timezone step, and Keep UTC saves `UTC` with the account. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    browserReports("UTC");
    fetchMock.mockImplementation(async () => signedUp(EMAIL));
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    // The step comes before the account: nothing has been sent yet.
    expect(
      await screen.findByRole("heading", { name: "Confirm your timezone" }),
    ).toBeInTheDocument();
    expect(requestsTo(/sign-up/)).toHaveLength(0);
    expect(landedOn()).toBeUndefined();

    await user.click(screen.getByRole("button", { name: "Keep UTC" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/check-email");
    expect(requestsTo(/sign-up/)).toHaveLength(1);
    expect(signUpBody()).toMatchObject({ email: EMAIL, timezone: "UTC" });
  });

  it("story-accounts-timezone-settings-ac-2 (picked zone): A browser that reports no usable zone gets the step too, and the zone picked there is saved with the account; nothing is sent for the detection. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { SignUpForm } = await import("./sign-up-form");

    for (const reported of [undefined, "Not/AZone"]) {
      browserReports(reported);
      fetchMock.mockReset();
      nav.push.mockReset();
      nav.replace.mockReset();
      fetchMock.mockImplementation(async () => signedUp(EMAIL));
      const user = userEvent.setup();
      const { unmount } = render(<SignUpForm />);

      await fillIn(user, EMAIL, PASSWORD);
      await user.click(screen.getByRole("button", { name: "Create account" }));

      await screen.findByRole("heading", { name: "Confirm your timezone" });
      expect(requestsTo(/sign-up/), String(reported)).toHaveLength(0);

      await user.selectOptions(
        screen.getByLabelText(/^timezone/i),
        "Asia/Tokyo",
      );
      await user.click(screen.getByRole("button", { name: "Continue" }));

      await waitFor(() => expect(landedOn(), String(reported)).toBeDefined());
      expect(landedOn()?.pathname).toBe("/check-email");
      expect(requestsTo(/sign-up/), String(reported)).toHaveLength(1);
      expect(signUpBody(), String(reported)).toMatchObject({
        timezone: "Asia/Tokyo",
      });
      unmount();
    }
  });

  it("story-accounts-timezone-settings-ac-9 (sign-up form error): When the server refuses the zone, sign-up shows a form error and does not go on. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    browserReports("Europe/Berlin");
    fetchMock.mockImplementation(async () =>
      json(
        { code: "INVALID_TIMEZONE", message: "Choose a valid timezone." },
        400,
      ),
    );
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    const { container } = render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() =>
      expect(announcements(container)).toContain("Choose a valid timezone."),
    );
    // The zone went to the server with the form, which is what refused it.
    expect(signUpBody()).toMatchObject({ timezone: "Europe/Berlin" });
    expect(landedOn()).toBeUndefined();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeEnabled();
  });
  it('story-accounts-timezone-settings-ac-17 (sign-up, UTC): After a sign-up from a browser that reports UTC, the step\'s first line is "Your browser reports UTC." and the rest is the same. [F-accounts-28] [bb-sign-in-7]', async () => {
    // [F-accounts-28] [bb-sign-in-7]
    browserReports("UTC");
    const { SignUpForm } = await import("./sign-up-form");
    const user = userEvent.setup();
    render(<SignUpForm />);

    await fillIn(user, EMAIL, PASSWORD);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await screen.findByRole("heading", { name: "Confirm your timezone" });
    expect(introduction()).toBe(`Your browser reports UTC. ${REST_OF_STEP}`);
  });

  it("story-accounts-timezone-settings-ac-17 (sign-up, no usable zone): After a sign-up from a browser that reported no zone, or a name that is not a valid zone, the step's first line is \"We couldn't detect your timezone.\" and the rest is the same. [F-accounts-28] [bb-sign-in-7]", async () => {
    // [F-accounts-28] [bb-sign-in-7]
    const { SignUpForm } = await import("./sign-up-form");

    for (const reported of [undefined, "Not/AZone"]) {
      browserReports(reported);
      const user = userEvent.setup();
      const { unmount } = render(<SignUpForm />);

      await fillIn(user, EMAIL, PASSWORD);
      await user.click(screen.getByRole("button", { name: "Create account" }));

      await screen.findByRole("heading", { name: "Confirm your timezone" });
      expect(introduction(), String(reported)).toBe(
        `We couldn't detect your timezone. ${REST_OF_STEP}`,
      );
      expect(requestsTo(/sign-up/), String(reported)).toHaveLength(0);
      unmount();
    }
  });

  it("story-accounts-timezone-settings-ac-18 (sign-up): Continue on the sign-up's timezone step, with the picker left as it opened, creates the account with `UTC`. (regression pin) [F-accounts-28] [F-accounts-30]", async () => {
    // [F-accounts-28] [F-accounts-30]
    const { SignUpForm } = await import("./sign-up-form");

    for (const reported of ["UTC", undefined]) {
      browserReports(reported);
      fetchMock.mockReset();
      nav.push.mockReset();
      fetchMock.mockImplementation(async () => signedUp(EMAIL));
      const user = userEvent.setup();
      const { unmount } = render(<SignUpForm />);

      await fillIn(user, EMAIL, PASSWORD);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await screen.findByRole("heading", { name: "Confirm your timezone" });
      expect(screen.getByLabelText(/^timezone/i), String(reported)).toHaveValue(
        "UTC",
      );
      await user.click(screen.getByRole("button", { name: "Continue" }));

      await waitFor(() => expect(landedOn(), String(reported)).toBeDefined());
      expect(requestsTo(/sign-up/), String(reported)).toHaveLength(1);
      expect(signUpBody(), String(reported)).toMatchObject({
        email: EMAIL,
        timezone: "UTC",
      });
      unmount();
    }
  });
});
