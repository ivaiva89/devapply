import { describe, expect, it } from "vitest";

interface ReturnPathModule {
  returnPath: (requested: string | undefined) => string;
}

async function load(): Promise<ReturnPathModule> {
  const specifier = "./return-path";
  return (await import(/* @vite-ignore */ specifier)) as ReturnPathModule;
}

describe("return-path", () => {
  it("story-accounts-timezone-settings-ac-5 (return path): A return path that leaves the site, or none, becomes `/`; a place on this site is kept whole. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    const { returnPath } = await load();
    const { origin } = window.location;

    for (const away of [
      undefined,
      "",
      "https://evil.example/steal",
      "//evil.example/steal",
      "javascript:alert(1)",
    ]) {
      expect(returnPath(away), String(away)).toBe("/");
    }

    expect(returnPath("/settings")).toBe("/settings");
    expect(returnPath("/settings?tab=timezone#top")).toBe(
      "/settings?tab=timezone#top",
    );
    expect(returnPath(`${origin}/settings?tab=timezone`)).toBe(
      "/settings?tab=timezone",
    );
  });

  it("story-accounts-timezone-settings-ac-20: The shared return-path check sends `/.//evil.example` to `/`. (regression pin) [F-accounts-12] [F-accounts-31]", async () => {
    // [F-accounts-12] [F-accounts-31]
    // The browser resolves "/.//evil.example" to the path "//evil.example",
    // which it reads as another site.
    const { returnPath } = await load();

    for (const away of [
      "/.//evil.example",
      "/.//evil.example/steal?token=1#top",
    ]) {
      expect(returnPath(away), away).toBe("/");
    }
  });
});
