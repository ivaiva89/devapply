// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("env", () => {
  it("story-accounts-database-environments-ac-5: A missing `DATABASE_URL` stops the build with an error naming the variable. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    vi.stubEnv("DATABASE_URL", DATABASE_URL);
    const { env } = await import("./env");
    expect(env.DATABASE_URL).toBe(DATABASE_URL);

    vi.resetModules();
    vi.stubEnv("DATABASE_URL", undefined);

    await expect(import("./env")).rejects.toThrow(/DATABASE_URL/);
  });

  it("story-accounts-database-environments-ac-6: `.env.example` lists every variable the app reads, by name only. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    const lines = readFileSync(resolve(process.cwd(), ".env.example"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"));

    // Name only: no value after the equals sign.
    for (const line of lines) {
      expect(line).toMatch(/^[A-Z][A-Z0-9_]*=(""|)$/);
    }
    const listed = lines.map((line) => line.split("=")[0]);

    vi.stubEnv("DATABASE_URL", DATABASE_URL);
    const { env } = await import("./env");

    expect(Object.keys(env).length).toBeGreaterThan(0);
    for (const name of Object.keys(env)) {
      expect(listed).toContain(name);
    }
  });
});
