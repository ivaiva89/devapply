import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and the server action
// the step calls: a call across the network in the running app. The step and
// its picker run for real.
const nav = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const setFirstTimezone = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/sign-up/timezone",
}));
vi.mock("@/features/timezone/api/set-first-timezone", () => ({
  setFirstTimezone,
}));

interface TimezoneConfirmModule {
  TimezoneConfirm: (props: { returnTo?: string }) => ReactNode;
}

async function load(): Promise<TimezoneConfirmModule> {
  const specifier = "./timezone-confirm";
  return (await import(/* @vite-ignore */ specifier)) as TimezoneConfirmModule;
}

// The place the step sent the visitor, whichever router call it used.
function landedOn(): string | undefined {
  const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0]?.[0];
  return typeof target === "string" ? target : undefined;
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

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  setFirstTimezone.mockReset();
  setFirstTimezone.mockResolvedValue({ ok: true });
});

describe("timezone-confirm", () => {
  it("story-accounts-timezone-settings-ac-4 (Continue): Continue saves the picked zone and returns to the return path. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();
    render(<TimezoneConfirm returnTo="/settings?tab=timezone" />);

    await user.selectOptions(screen.getByLabelText(/^timezone/i), "Asia/Tokyo");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(setFirstTimezone).toHaveBeenCalledTimes(1);
    expect(setFirstTimezone).toHaveBeenCalledWith("Asia/Tokyo");
    expect(landedOn()).toBe("/settings?tab=timezone");
  });

  it("story-accounts-timezone-settings-ac-4 (Keep UTC): Keep UTC saves `UTC` and returns to the return path. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();
    render(<TimezoneConfirm returnTo="/settings" />);

    await user.click(screen.getByRole("button", { name: "Keep UTC" }));

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(setFirstTimezone).toHaveBeenCalledTimes(1);
    expect(setFirstTimezone).toHaveBeenCalledWith("UTC");
    expect(landedOn()).toBe("/settings");
  });

  it("story-accounts-timezone-settings-ac-5 (return path): A return path that leaves the site, or none, returns to `/`. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();

    for (const returnTo of [undefined, "https://evil.example/steal"]) {
      nav.push.mockReset();
      nav.replace.mockReset();
      const { unmount } = render(<TimezoneConfirm returnTo={returnTo} />);

      await user.click(screen.getByRole("button", { name: "Keep UTC" }));

      await waitFor(() => expect(landedOn(), String(returnTo)).toBeDefined());
      expect(landedOn(), String(returnTo)).toBe("/");
      unmount();
    }
  });

  it("story-accounts-timezone-settings-ac-9 (confirm step): When the server refuses the zone, the step shows a field error and stays. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    setFirstTimezone.mockResolvedValue({
      ok: false,
      error: "Choose a timezone from the list.",
    });
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneConfirm returnTo="/settings" />);

    await user.selectOptions(screen.getByLabelText(/^timezone/i), "Asia/Tokyo");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(announcements(container)).toContain(
        "Choose a timezone from the list.",
      ),
    );
    expect(screen.getByLabelText(/^timezone/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(landedOn()).toBeUndefined();
  });
});
