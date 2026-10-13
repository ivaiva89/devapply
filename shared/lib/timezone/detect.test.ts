import { afterEach, describe, expect, it, vi } from "vitest";

interface DetectModule {
  detectTimezone: () => string | null;
}

async function load(): Promise<DetectModule> {
  const specifier = "./detect";
  return (await import(/* @vite-ignore */ specifier)) as DetectModule;
}

// What the browser's Intl answers when asked for its time zone: the one
// browser API the detection reads.
function browserReports(zone: string | undefined): void {
  const actual = Intl.DateTimeFormat.prototype.resolvedOptions;
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(
    function (this: Intl.DateTimeFormat) {
      return { ...actual.call(this), timeZone: zone as string };
    },
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("detect", () => {
  it("story-accounts-timezone-settings-ac-1 (detect): The browser's valid zone is read as it reports it. [F-accounts-13] [bb-sign-in-18]", async () => {
    // [F-accounts-13] [bb-sign-in-18]
    browserReports("Europe/Berlin");
    const { detectTimezone } = await load();

    expect(detectTimezone()).toBe("Europe/Berlin");
  });

  it("story-accounts-timezone-settings-ac-2 (detect): A browser that reports UTC reads as UTC, and one that reports no zone or an invalid name reads as no usable zone. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { detectTimezone } = await load();

    browserReports("UTC");
    expect(detectTimezone()).toBe("UTC");

    browserReports(undefined);
    expect(detectTimezone()).toBeNull();

    browserReports("Not/AZone");
    expect(detectTimezone()).toBeNull();
  });
});
