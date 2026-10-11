import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// form and Better Auth's browser client run for real; the server's behaviour
// (the email that goes out, or does not) is asserted in
// shared/lib/auth/server.test.ts.
const nav = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
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
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/forgot-password",
}));

// The form is loaded when a test runs, so a build where it is missing fails
// that test and leaves the suite loadable.
function load<T>(specifier: string): Promise<T> {
  return import(/* @vite-ignore */ specifier) as Promise<T>;
}

const REGISTERED = "dev@example.com";
const UNKNOWN = "nobody@example.com";

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

// What Better Auth's request-password-reset endpoint answers, whether or not
// the address has an account (its own response text, from its source).
function accepted(): Response {
  return json({
    status: true,
    message:
      "If this email exists in our system, check your email for the reset link",
  });
}

// What the visitor can read on the page, with the typed address masked so two
// visits with different addresses can be compared.
function visibleText(container: HTMLElement, email: string): string {
  return (container.textContent ?? "")
    .replaceAll(email, "<email>")
    .replace(/\s+/g, " ")
    .trim();
}

// Lets any state the form passes through on its way to the confirmation go by.
function settled(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

// Once the form has settled, the confirmation is still on the page, differs
// from the untouched form, and is announced from a status region.
async function expectConfirmationStays(
  container: HTMLElement,
  before: string,
  email: string,
) {
  await settled();
  expect(visibleText(container, email)).not.toBe(before);
  const status = within(container).getByRole("status");
  expect(status.textContent?.trim()).toBeTruthy();
  expect(container.textContent).toContain(status.textContent?.trim());
}

async function requestLinkFor(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
) {
  await user.type(screen.getByLabelText(/^email/i), email);
  await user.click(screen.getByRole("button", { name: "Send reset link" }));
}

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("forgot-password-form", () => {
  it("story-accounts-password-reset-ac-1: `/forgot-password` sends a reset link to a registered email. [F-accounts-7] [bb-sign-in-11]", async () => {
    // [F-accounts-7] [bb-sign-in-11]
    fetchMock.mockImplementation(async () => accepted());
    const { ForgotPasswordForm } = await load<{
      ForgotPasswordForm: ComponentType;
    }>("./forgot-password-form");
    const user = userEvent.setup();
    const { container } = render(<ForgotPasswordForm />);
    const before = visibleText(container, REGISTERED);

    await requestLinkFor(user, REGISTERED);

    // The address went to Better Auth's reset request, once.
    await waitFor(() =>
      expect(requestsTo(/request-password-reset/)).toHaveLength(1),
    );
    const [, init] = requestsTo(/request-password-reset/)[0];
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      email: REGISTERED,
    });

    // The page tells the visitor the request went through: it changes, and
    // what it says is not an error.
    await waitFor(() =>
      expect(visibleText(container, REGISTERED)).not.toBe(before),
    );
    expect(container.querySelector('[role="alert"]')).toBeNull();

    // Once the form has settled, the confirmation is still there, and it sits
    // in a status region.
    await expectConfirmationStays(container, before, REGISTERED);
  });

  it("story-accounts-password-reset-ac-2: For an email with no account, the page shows the same confirmation and sends nothing. [F-accounts-7]", async () => {
    // [F-accounts-7]
    // Better Auth answers an address with an account and one without in the
    // same words, so the page has nothing to tell them apart by.
    fetchMock.mockImplementation(async () => accepted());
    const { ForgotPasswordForm } = await load<{
      ForgotPasswordForm: ComponentType;
    }>("./forgot-password-form");
    const user = userEvent.setup();

    const registered = render(<ForgotPasswordForm />);
    const before = visibleText(registered.container, REGISTERED);
    await requestLinkFor(user, REGISTERED);
    await waitFor(() =>
      expect(requestsTo(/request-password-reset/)).toHaveLength(1),
    );
    await waitFor(() =>
      expect(visibleText(registered.container, REGISTERED)).not.toBe(before),
    );
    await expectConfirmationStays(registered.container, before, REGISTERED);
    const confirmation = visibleText(registered.container, REGISTERED);
    registered.unmount();

    const unknown = render(<ForgotPasswordForm />);
    await requestLinkFor(user, UNKNOWN);
    await waitFor(() =>
      expect(requestsTo(/request-password-reset/)).toHaveLength(2),
    );

    // The same confirmation, down to the words, and nothing that says the
    // address has no account.
    await waitFor(() =>
      expect(visibleText(unknown.container, UNKNOWN)).toBe(confirmation),
    );
    await expectConfirmationStays(unknown.container, before, UNKNOWN);
    expect(visibleText(unknown.container, UNKNOWN)).toBe(confirmation);
    expect(unknown.container.querySelector('[role="alert"]')).toBeNull();
    expect(unknown.container.textContent).not.toMatch(
      /no account|not found|doesn.t exist|not registered/i,
    );
  });
});
