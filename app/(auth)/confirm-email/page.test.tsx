import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// page, its button and Better Auth's browser client run for real.
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
  usePathname: () => "/confirm-email",
}));

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

// The shape of the token Better Auth puts in the link: a signed JWT whose
// payload names the address.
function emailedToken(email: string): string {
  const part = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${part({ alg: "HS256" })}.${part({ email, iat: 1790000000 })}.signature`;
}

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.search = "";
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

describe("page", () => {
  it("story-accounts-email-sign-up-ac-4: Opening the confirmation link does not confirm the email; pressing its Confirm button does. [F-accounts-2] [bb-sign-in-9]", async () => {
    // [F-accounts-2] [bb-sign-in-9]
    fetchMock.mockImplementation(async () => json({ status: true }));
    const token = emailedToken("dev@example.com");
    nav.search = `?token=${token}`;
    const { default: ConfirmEmailPage } = await import("./page");
    const props = {
      params: Promise.resolve({}),
      searchParams: Promise.resolve({ token }),
    };
    const user = userEvent.setup();

    // Opening the link: the page renders, and nothing is sent.
    render(await ConfirmEmailPage(props));
    const confirm = await screen.findByRole("button", {
      name: "Confirm email",
    });
    expect(requestsTo(/verify-email/)).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();

    // Pressing the button: the token is sent, once.
    await user.click(confirm);

    await waitFor(() => expect(requestsTo(/verify-email/)).toHaveLength(1));
    const [input, init] = requestsTo(/verify-email/)[0];
    expect(
      `${requestUrl(input)} ${String((init as RequestInit)?.body)}`,
    ).toContain(encodeURIComponent(token));
  });
});
