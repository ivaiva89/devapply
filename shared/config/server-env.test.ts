// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

// A value that passes validation, for every name `.env.example` lists. A name
// that is not here gets a generic string: when a later variable needs a
// stricter shape, add its sample here.
const SAMPLE_VALUES: Record<string, string> = {
  DATABASE_URL,
  DATABASE_URL_UNPOOLED: "postgresql://user:pass@localhost:5432/direct",
};

function listedNames(): string[] {
  return readFileSync(resolve(process.cwd(), ".env.example"), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"))
    .map((line) => line.split("=")[0]);
}

// Stubs every listed name with a valid value, except the ones in `except`,
// which are stubbed unset.
function stubListed(except: string[] = []): void {
  for (const name of listedNames()) {
    vi.stubEnv(
      name,
      except.includes(name)
        ? undefined
        : (SAMPLE_VALUES[name] ?? "sample-value"),
    );
  }
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.doUnmock("server-only");
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("server-env", () => {
  it("story-accounts-env-module-split-ac-1: Importing the server env module from a client component fails the build. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    // A client component's bundle resolves `server-only` to the module that
    // throws; the default resolution (no react-server condition), which is
    // what Vitest uses, is that same module. Valid values keep validation
    // from being the thing that throws.
    vi.stubEnv("DATABASE_URL", DATABASE_URL);

    await expect(import("./server-env")).rejects.toThrow(/Client Component/);
  });

  it("story-accounts-env-module-split-ac-2: Importing the server env module with a variable missing or malformed throws an error that names every offending variable, not only the first. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    // The suite runs in plain Node, which is a server context: the marker
    // package is a no-op there.
    vi.doMock("server-only", () => ({}));

    // Control: with every listed name set to a valid value the module loads
    // and hands the value back, so the failures below come from the variable
    // and from nothing else.
    stubListed();
    const { env } = await import("./server-env");
    expect(env.DATABASE_URL).toBe(DATABASE_URL);
    // A name is required when the module refuses to load with only that name
    // unset; an optional name is in `env` when set but is never offending.
    const required: string[] = [];
    for (const name of Object.keys(env)) {
      vi.resetModules();
      stubListed([name]);
      const loaded = await import("./server-env").then(
        () => true,
        () => false,
      );
      if (!loaded) required.push(name);
    }
    expect(required).toContain("DATABASE_URL");

    const offending: Record<string, string | undefined> = {
      missing: undefined,
      // A variable that is set but empty counts as missing.
      empty: "",
      malformed: "not a url",
    };
    for (const [kind, value] of Object.entries(offending)) {
      vi.resetModules();
      stubListed(["DATABASE_URL"]);
      vi.stubEnv("DATABASE_URL", value);

      await expect(
        import("./server-env"),
        `DATABASE_URL ${kind}`,
      ).rejects.toThrow(/DATABASE_URL/);
    }

    // Everything unset at once: the one error names every variable the
    // module requires, so the check grows with the schema.
    vi.resetModules();
    for (const name of listedNames()) vi.stubEnv(name, undefined);

    const failure = await import("./server-env").then(
      () => undefined,
      (error: unknown) => (error instanceof Error ? error.message : ""),
    );
    expect(failure, "the import rejected").toBeDefined();
    for (const name of required) {
      expect(failure, `error names ${name}`).toContain(name);
    }
  });

  it("story-accounts-env-module-split-ac-5: `pnpm test` fails when `.env.example` lists a variable nothing reads, or when the server env module reads a variable `.env.example` omits. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    vi.doMock("server-only", () => ({}));
    const listed = listedNames();

    // Forward: with every listed name set the module loads, so a name it
    // requires that `.env.example` omits is unset here and the import
    // rejects. Everything it exposes is a listed name.
    stubListed();
    const { env } = await import("./server-env");
    for (const key of Object.keys(env)) {
      expect(listed, `${key} is read by the module`).toContain(key);
    }

    // Reverse: each listed name is read by the module, or by a root config
    // file. `DATABASE_URL_UNPOOLED` is read by drizzle.config.ts alone: with
    // only it unset, loading that config rejects with an error naming it.
    const unread: string[] = [];
    for (const name of listed) {
      if (name in env) continue;

      vi.resetModules();
      stubListed([name]);
      const failure = await import("../../drizzle.config").then(
        () => undefined,
        (error: unknown) => (error instanceof Error ? error.message : ""),
      );
      if (!failure?.includes(name)) unread.push(name);
    }
    expect(unread, "listed in .env.example but read by nothing").toEqual([]);
  });

  it("story-bug-build-fails-without-server-env-ac-3: Importing the server env module with a required variable missing still throws at import and names every offending variable. (regression pin)", async () => {
    vi.doMock("server-only", () => ({}));

    // Two required variables unset at once, the rest valid: the one error
    // names both, not only the first.
    stubListed(["DATABASE_URL", "BETTER_AUTH_SECRET"]);
    const failure = await import("./server-env").then(
      () => undefined,
      (error: unknown) => (error instanceof Error ? error.message : ""),
    );

    expect(failure, "the import rejected").toBeDefined();
    expect(failure).toContain("DATABASE_URL");
    expect(failure).toContain("BETTER_AUTH_SECRET");
  });
});
