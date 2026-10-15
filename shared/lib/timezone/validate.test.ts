import { describe, expect, it } from "vitest";

// Loaded when a test runs, so a tree without validate.ts still type-checks
// while the tests fail.
interface ValidateModule {
  isValidTimezone: (value: unknown) => boolean;
}

async function load(): Promise<ValidateModule> {
  const specifier = "./validate";
  return (await import(/* @vite-ignore */ specifier)) as ValidateModule;
}

describe("validate", () => {
  it("story-accounts-timezone-settings-ac-1 (valid names): A real IANA zone name is accepted, `UTC` included. [F-accounts-13] [bb-sign-in-18]", async () => {
    // [F-accounts-13] [bb-sign-in-18]
    const { isValidTimezone } = await load();

    for (const name of [
      "Europe/Berlin",
      "America/New_York",
      "Asia/Kolkata",
      "Pacific/Auckland",
      "UTC",
    ]) {
      expect(isValidTimezone(name), name).toBe(true);
    }
  });

  it("story-accounts-timezone-settings-ac-9 (validator): A name that is not a valid zone is refused. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    const { isValidTimezone } = await load();

    for (const value of [
      "Not/AZone",
      "Mars/Olympus_Mons",
      "Berlin",
      "Europe/Berlin; drop table user",
      "",
      "   ",
      42,
      null,
      undefined,
      {},
    ]) {
      expect(isValidTimezone(value), String(value)).toBe(false);
    }
  });
});
