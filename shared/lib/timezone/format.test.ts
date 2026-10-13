import { describe, expect, it } from "vitest";

interface FormatModule {
  formatInstant: (instant: Date, timezone: string | null | undefined) => string;
}

async function load(): Promise<FormatModule> {
  const specifier = "./format";
  return (await import(/* @vite-ignore */ specifier)) as FormatModule;
}

// Whether the text shows this day of the month, whatever the date's layout.
function showsDay(text: string, day: number): boolean {
  return new RegExp(`(^|\\D)0?${day}(\\D|$)`).test(text);
}

// 23:30 UTC on the 13th: already the 14th in Berlin (UTC+2 in October) and in
// Tokyo (UTC+9), still the 13th in New York (UTC-4).
const LATE_EVENING = "2026-10-13T23:30:00.000Z";

describe("format", () => {
  it("story-accounts-timezone-settings-ac-7 (helper): While the account has no timezone, a date appears in UTC. [new] [bb-sign-in-17]", async () => {
    // [new] [bb-sign-in-17]
    const { formatInstant } = await load();
    const instant = new Date(LATE_EVENING);

    for (const none of [null, undefined]) {
      const shown = formatInstant(instant, none);
      expect(shown, String(none)).toBe(formatInstant(instant, "UTC"));
      expect(showsDay(shown, 13), shown).toBe(true);
      expect(showsDay(shown, 14), shown).toBe(false);
    }
    // Showing a date reads the instant and changes nothing about it.
    expect(instant.toISOString()).toBe(LATE_EVENING);
  });

  it("story-accounts-timezone-settings-ac-10 (helper): A date appears in the zone it is given, and the instant itself is unchanged. [F-accounts-15] [bb-sign-in-17]", async () => {
    // [F-accounts-15] [bb-sign-in-17]
    const { formatInstant } = await load();
    const instant = new Date(LATE_EVENING);

    const berlin = formatInstant(instant, "Europe/Berlin");
    expect(showsDay(berlin, 14), berlin).toBe(true);
    expect(showsDay(berlin, 13), berlin).toBe(false);

    const tokyo = formatInstant(instant, "Asia/Tokyo");
    expect(showsDay(tokyo, 14), tokyo).toBe(true);
    expect(tokyo).not.toBe(berlin);

    const newYork = formatInstant(instant, "America/New_York");
    expect(showsDay(newYork, 13), newYork).toBe(true);
    expect(showsDay(newYork, 14), newYork).toBe(false);

    expect(instant.toISOString()).toBe(LATE_EVENING);
  });
});
