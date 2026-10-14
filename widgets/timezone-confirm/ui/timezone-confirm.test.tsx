import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

const SAVE_FAILED = "We couldn't save your timezone. Try again.";
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

// What the browser's Intl answers when asked for its time zone. Restores
// first, so a second call stubs the original and not the stub.
function browserReports(zone: string | undefined): void {
  vi.restoreAllMocks();
  const actual = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...actual.call(this), timeZone: zone as string };
    },
  );
}

// The words under the heading, from their first line to the end.
function introduction(): string {
  return plain(
    screen.getByRole("heading", { level: 1 }).nextElementSibling?.textContent,
  );
}

beforeEach(() => {
  // The step is shown to a browser that reports UTC or no usable zone; the
  // tests about the first line set the one they need.
  browserReports("UTC");
  nav.push.mockReset();
  nav.replace.mockReset();
  setFirstTimezone.mockReset();
  setFirstTimezone.mockResolvedValue({ ok: true });
});

afterEach(() => {
  vi.restoreAllMocks();
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
  it("story-accounts-timezone-settings-ac-16 (failed save): A save that fails shows the message as its own alert, not as the picker's field error, and both buttons can be pressed again. [F-accounts-29] [F-accounts-30]", async () => {
    // [F-accounts-29] [F-accounts-30]
    setFirstTimezone.mockRejectedValueOnce(new Error("connection lost"));
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneConfirm returnTo="/settings" />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(announcements(container).map(plain)).toContain(SAVE_FAILED),
    );
    // Apart from the field error: the picker is not marked invalid and does
    // not point at the message.
    const picker = screen.getByLabelText(/^timezone/i);
    expect(picker).not.toHaveAttribute("aria-invalid", "true");
    const described = (picker.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent ?? "");
    expect(described.map(plain)).not.toContain(SAVE_FAILED);
    expect(landedOn()).toBeUndefined();
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Keep UTC" })).toBeEnabled();

    // Pressed again, it saves.
    await user.click(screen.getByRole("button", { name: "Keep UTC" }));

    await waitFor(() => expect(landedOn()).toBe("/settings"));
    expect(setFirstTimezone).toHaveBeenCalledTimes(2);
    expect(setFirstTimezone).toHaveBeenLastCalledWith("UTC");
  });

  it("story-accounts-timezone-settings-ac-16 (refusal and failure): A refused zone name keeps its field error under the picker and shows no save message; a failed save after it shows the message apart from that error. [F-accounts-29] [F-accounts-30]", async () => {
    // [F-accounts-29] [F-accounts-30]
    setFirstTimezone
      .mockResolvedValueOnce({
        ok: false,
        error: "Choose a timezone from the list.",
      })
      .mockRejectedValueOnce(new Error("connection lost"));
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneConfirm returnTo="/settings" />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(announcements(container).map(plain)).toContain(
        "Choose a timezone from the list.",
      ),
    );
    expect(plain(container.textContent)).not.toContain(SAVE_FAILED);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(announcements(container).map(plain)).toContain(SAVE_FAILED),
    );
    const picker = screen.getByLabelText(/^timezone/i);
    const described = (picker.getAttribute("aria-describedby") ?? "")
      .split(" ")
      .map((id) => document.getElementById(id)?.textContent ?? "");
    expect(described.map(plain)).not.toContain(SAVE_FAILED);
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Keep UTC" })).toBeEnabled();
    expect(landedOn()).toBeUndefined();
  });

  it('story-accounts-timezone-settings-ac-17 (UTC): For a browser that reports UTC the step\'s first line is "Your browser reports UTC." and the rest is the same. [F-accounts-28] [F-accounts-30] [bb-sign-in-7]', async () => {
    // [F-accounts-28] [F-accounts-30] [bb-sign-in-7]
    browserReports("UTC");
    const { TimezoneConfirm } = await load();

    render(<TimezoneConfirm returnTo="/settings" />);

    await waitFor(() =>
      expect(introduction()).toBe(`Your browser reports UTC. ${REST_OF_STEP}`),
    );
  });

  it('story-accounts-timezone-settings-ac-17 (no usable zone): For a browser that reported no zone, or a name that is not a valid zone, the first line is "We couldn\'t detect your timezone." and the rest is the same. [F-accounts-28] [F-accounts-30] [bb-sign-in-7]', async () => {
    // [F-accounts-28] [F-accounts-30] [bb-sign-in-7]
    const { TimezoneConfirm } = await load();

    for (const reported of [undefined, "Not/AZone"]) {
      browserReports(reported);
      const { unmount } = render(<TimezoneConfirm returnTo="/settings" />);

      await waitFor(() =>
        expect(introduction(), String(reported)).toBe(
          `We couldn't detect your timezone. ${REST_OF_STEP}`,
        ),
      );
      // Nothing else on the step changes with the first line.
      expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Keep UTC" })).toBeEnabled();
      unmount();
    }
  });

  it("story-accounts-timezone-settings-ac-17 (hydration): The first line is settled in the browser: a page the server drew for UTC hydrates in a browser with no usable zone without a mismatch and then says so. [F-accounts-28] [F-accounts-30]", async () => {
    // [F-accounts-28] [F-accounts-30]
    const { TimezoneConfirm } = await load();
    browserReports("UTC");
    const served = renderToString(<TimezoneConfirm returnTo="/settings" />);
    const host = document.createElement("div");
    host.innerHTML = served;
    document.body.append(host);
    const mismatches = vi.fn();

    browserReports(undefined);
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(host, <TimezoneConfirm returnTo="/settings" />, {
          onRecoverableError: mismatches,
        });
      });

      await waitFor(() =>
        expect(
          plain(host.querySelector("h1")?.nextElementSibling?.textContent),
        ).toBe(`We couldn't detect your timezone. ${REST_OF_STEP}`),
      );
      expect(mismatches).not.toHaveBeenCalled();
    } finally {
      await act(async () => root?.unmount());
      host.remove();
    }
  });

  it("story-accounts-timezone-settings-ac-18 (confirm step): Continue with the picker left as it opened saves `UTC`. (regression pin) [F-accounts-28] [F-accounts-30]", async () => {
    // [F-accounts-28] [F-accounts-30]
    const { TimezoneConfirm } = await load();
    const user = userEvent.setup();

    for (const reported of ["UTC", undefined]) {
      browserReports(reported);
      setFirstTimezone.mockClear();
      const { unmount } = render(<TimezoneConfirm returnTo="/settings" />);

      expect(screen.getByLabelText(/^timezone/i), String(reported)).toHaveValue(
        "UTC",
      );
      await user.click(screen.getByRole("button", { name: "Continue" }));

      await waitFor(() =>
        expect(setFirstTimezone, String(reported)).toHaveBeenCalledTimes(1),
      );
      expect(setFirstTimezone).toHaveBeenCalledWith("UTC");
      unmount();
    }
  });
});
