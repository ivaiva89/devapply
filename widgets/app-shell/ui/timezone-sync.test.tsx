import { render, waitFor } from "@testing-library/react";
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
});
