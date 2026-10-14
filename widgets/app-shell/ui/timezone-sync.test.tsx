import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the framework's router and route, the browser's
// Intl and the server action the sync calls: a call across the network in the
// running app. The sync and the detection run for real.
const nav = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  pathname: "/settings",
  search: "",
}));
const setFirstTimezone = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: nav.push,
    replace: nav.replace,
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => nav.pathname,
}));
vi.mock("@/features/timezone/api/set-first-timezone", () => ({
  setFirstTimezone,
}));

interface TimezoneSyncModule {
  TimezoneSync: (props: { timezone: string | null }) => ReactNode;
}

async function load(): Promise<TimezoneSyncModule> {
  const specifier = "./timezone-sync";
  return (await import(/* @vite-ignore */ specifier)) as TimezoneSyncModule;
}

// What the browser's Intl answers when asked for its time zone.
function browserReports(zone: string | undefined): void {
  const actual = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...actual.call(this), timeZone: zone as string };
    },
  );
}

// The place the sync sent the visitor, whichever router call it used.
function landedOn(): URL | undefined {
  const target = [...nav.push.mock.calls, ...nav.replace.mock.calls][0]?.[0];
  return typeof target === "string"
    ? new URL(target, "http://localhost:3000")
    : undefined;
}

const SAVE_FAILED = "We couldn't save your timezone. Try again.";

// The text with the typographic apostrophe written plain, so the message is
// held to its words and not to which apostrophe the page uses.
function plain(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/\u2019/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Everything on screen that a screen reader announces, with its text.
function announcements(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll(
      '[role="alert"], [aria-live="polite"], [aria-live="assertive"]',
    ),
  )
    .map((node) => plain(node.textContent))
    .filter((text) => text.length > 0);
}

// A call the test settles by hand, to hold a save in flight.
function pendingSave() {
  let settle: (result: unknown) => void = () => {};
  const promise = new Promise((resolve) => {
    settle = resolve;
  });
  return { promise, settle };
}

// Time for any effect, and any promise it started, to run.
async function settleEffects(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 30));
}

beforeEach(() => {
  nav.push.mockReset();
  nav.replace.mockReset();
  nav.pathname = "/settings";
  nav.search = "";
  setFirstTimezone.mockReset();
  setFirstTimezone.mockResolvedValue({ ok: true });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("timezone-sync", () => {
  it("story-accounts-timezone-settings-ac-3 (sync): On a signed-in page of an account with no timezone, a valid browser zone other than UTC is saved without a question. [new] [bb-sign-in-18]", async () => {
    // [new] [bb-sign-in-18]
    browserReports("Europe/Berlin");
    const { TimezoneSync } = await load();

    render(<TimezoneSync timezone={null} />);

    await waitFor(() => expect(setFirstTimezone).toHaveBeenCalledTimes(1));
    expect(setFirstTimezone).toHaveBeenCalledWith("Europe/Berlin");
    expect(landedOn()).toBeUndefined();
  });

  it("story-accounts-timezone-settings-ac-4 (sync): On that page, a browser that reports UTC is sent to `/sign-up/timezone` with the page as its return path, and nothing is saved. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    nav.pathname = "/settings";
    nav.search = "?tab=timezone";
    browserReports("UTC");
    const { TimezoneSync } = await load();

    render(<TimezoneSync timezone={null} />);

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/sign-up/timezone");
    expect(landedOn()?.searchParams.get("returnTo")).toBe(
      "/settings?tab=timezone",
    );
    expect(setFirstTimezone).not.toHaveBeenCalled();
  });

  it("story-accounts-timezone-settings-ac-4 (no usable zone): A browser that reports no zone, or a name that is not a valid zone, is sent to the confirm step and nothing is saved. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { TimezoneSync } = await load();

    for (const reported of [undefined, "Not/AZone"]) {
      nav.push.mockReset();
      nav.replace.mockReset();
      browserReports(reported);

      const { unmount } = render(<TimezoneSync timezone={null} />);

      await waitFor(() => expect(landedOn(), String(reported)).toBeDefined());
      expect(landedOn()?.pathname, String(reported)).toBe("/sign-up/timezone");
      expect(landedOn()?.searchParams.get("returnTo")).toBe("/settings");
      expect(setFirstTimezone, String(reported)).not.toHaveBeenCalled();
      unmount();
      vi.restoreAllMocks();
    }
  });

  it("story-accounts-timezone-settings-ac-6 (sync): A timezone that is set, `UTC` included, is never changed by a page load, whatever the browser reports. [new]", async () => {
    // [new]
    const { TimezoneSync } = await load();

    for (const [saved, reported] of [
      ["UTC", "Asia/Tokyo"],
      ["Europe/Berlin", "UTC"],
      ["Europe/Berlin", "Asia/Tokyo"],
      ["Europe/Berlin", undefined],
    ] as const) {
      browserReports(reported);

      const { unmount } = render(<TimezoneSync timezone={saved} />);
      // Let any effect and any promise it started run.
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(setFirstTimezone, `${saved} / ${reported}`).not.toHaveBeenCalled();
      expect(landedOn(), `${saved} / ${reported}`).toBeUndefined();
      unmount();
      vi.restoreAllMocks();
    }
  });
  it("story-accounts-timezone-settings-ac-4 (refused zone): A browser zone the server refuses is not a failed save: it still goes to the confirm step, with no message and no Retry. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    browserReports("Europe/Berlin");
    setFirstTimezone.mockResolvedValue({
      ok: false,
      error: "Choose a timezone from the list.",
    });
    const { TimezoneSync } = await load();

    const { container } = render(<TimezoneSync timezone={null} />);

    await waitFor(() => expect(landedOn()).toBeDefined());
    expect(landedOn()?.pathname).toBe("/sign-up/timezone");
    expect(landedOn()?.searchParams.get("returnTo")).toBe("/settings");
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
    expect(plain(container.textContent)).not.toContain(SAVE_FAILED);
  });

  it("story-accounts-timezone-settings-ac-16 (failed save): When saving the browser's zone fails, the page shows the message with a Retry button, saves no UTC, shows no success and tries nothing more on its own. [F-accounts-29] [bb-sign-in-18]", async () => {
    // [F-accounts-29] [bb-sign-in-18]
    browserReports("Europe/Berlin");
    setFirstTimezone.mockRejectedValue(new Error("connection lost"));
    const { TimezoneSync } = await load();

    const { container } = render(<TimezoneSync timezone={null} />);

    await waitFor(() =>
      expect(announcements(container).join("\n")).toContain(SAVE_FAILED),
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
    // One attempt on this page, and none of its own after it failed.
    await settleEffects();
    expect(setFirstTimezone).toHaveBeenCalledTimes(1);
    expect(setFirstTimezone).toHaveBeenCalledWith("Europe/Berlin");
    expect(setFirstTimezone).not.toHaveBeenCalledWith("UTC");
    // Not sent to the confirm step: the zone was fine, the save was not.
    expect(landedOn()).toBeUndefined();
    // Nothing says it was saved.
    expect(plain(container.textContent)).not.toMatch(/saved|success/i);
  });

  it("story-accounts-timezone-settings-ac-16 (Retry): Retry tries the save once per press; a Retry that fails again leaves the message and nothing more is tried until Retry is pressed again, and one that works clears the message. [F-accounts-29] [bb-sign-in-18]", async () => {
    // [F-accounts-29] [bb-sign-in-18]
    browserReports("Asia/Tokyo");
    setFirstTimezone.mockRejectedValue(new Error("connection lost"));
    const { TimezoneSync } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneSync timezone={null} />);
    await waitFor(() =>
      expect(announcements(container).join("\n")).toContain(SAVE_FAILED),
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(setFirstTimezone).toHaveBeenCalledTimes(2));
    expect(setFirstTimezone).toHaveBeenLastCalledWith("Asia/Tokyo");
    // It failed again: the message stays, and the page does not try on its own.
    await waitFor(() =>
      expect(announcements(container).join("\n")).toContain(SAVE_FAILED),
    );
    await settleEffects();
    expect(setFirstTimezone).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Retry" })).toBeEnabled();
    expect(setFirstTimezone).not.toHaveBeenCalledWith("UTC");
    expect(landedOn()).toBeUndefined();

    setFirstTimezone.mockResolvedValue({ ok: true });
    await user.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(setFirstTimezone).toHaveBeenCalledTimes(3));
    await waitFor(() => expect(announcements(container)).toEqual([]));
    expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
    expect(plain(container.textContent)).not.toContain(SAVE_FAILED);
  });

  it("story-accounts-timezone-settings-ac-16 (in flight): A Retry that is still in flight does not start a second call when pressed again. [F-accounts-29]", async () => {
    // [F-accounts-29]
    browserReports("Asia/Tokyo");
    const retrying = pendingSave();
    setFirstTimezone
      .mockRejectedValueOnce(new Error("connection lost"))
      .mockReturnValueOnce(retrying.promise);
    const { TimezoneSync } = await load();
    const user = userEvent.setup();
    const { container } = render(<TimezoneSync timezone={null} />);
    await waitFor(() =>
      expect(announcements(container).join("\n")).toContain(SAVE_FAILED),
    );
    const retry = screen.getByRole("button", { name: "Retry" });

    await user.click(retry);
    await user.click(retry);
    await settleEffects();

    expect(setFirstTimezone).toHaveBeenCalledTimes(2);
    retrying.settle({ ok: true });
    await waitFor(() => expect(announcements(container)).toEqual([]));
    expect(setFirstTimezone).toHaveBeenCalledTimes(2);
  });

  it("story-accounts-timezone-settings-ac-16 (next page): Moving to another page while the account still has no timezone makes one attempt on that page, and that one is not repeated on its own when it fails. [F-accounts-29]", async () => {
    // [F-accounts-29]
    browserReports("Asia/Tokyo");
    setFirstTimezone.mockRejectedValue(new Error("connection lost"));
    const { TimezoneSync } = await load();
    const { container, rerender } = render(<TimezoneSync timezone={null} />);
    await waitFor(() =>
      expect(announcements(container).join("\n")).toContain(SAVE_FAILED),
    );
    expect(setFirstTimezone).toHaveBeenCalledTimes(1);

    nav.pathname = "/";
    rerender(<TimezoneSync timezone={null} />);

    await waitFor(() => expect(setFirstTimezone).toHaveBeenCalledTimes(2));
    await settleEffects();
    expect(setFirstTimezone).toHaveBeenCalledTimes(2);
    expect(announcements(container).join("\n")).toContain(SAVE_FAILED);
  });
});
