import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the network. The
// button and Better Auth's browser client run for real.
const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const fetchMock = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/settings",
}));

interface SignOutButtonModule {
  SignOutButton: () => ReactNode;
}

async function load(): Promise<SignOutButtonModule> {
  const specifier = "./sign-out-button";
  return (await import(/* @vite-ignore */ specifier)) as SignOutButtonModule;
}

function requestUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return (input as Request).url;
}

function landedOn(): URL | undefined {
  const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0]?.[0];
  return typeof target === "string"
    ? new URL(target, "http://localhost:3000")
    : undefined;
}

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  fetchMock.mockReset();
  fetchMock.mockImplementation(
    async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
});

describe("sign-out-button", () => {
  it("story-accounts-timezone-settings-ac-11: Sign out ends the session on that device and returns to sign in. [F-accounts-11]", async () => {
    // [F-accounts-11]
    const { SignOutButton } = await load();
    const user = userEvent.setup();
    render(<SignOutButton />);

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/sign-in");
    const signOuts = fetchMock.mock.calls.filter(([input]) =>
      /\/api\/auth\/sign-out/.test(requestUrl(input)),
    );
    expect(signOuts).toHaveLength(1);
    expect((signOuts[0]?.[1] as RequestInit | undefined)?.method).toBe("POST");
  });
});
