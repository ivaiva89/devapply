// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.doUnmock("server-only");
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("client", () => {
  it("story-accounts-database-environments-ac-1: A server-side Drizzle query against Neon returns a result on development and on production. [bb-sign-in-28]", async () => { // [bb-sign-in-28]
    // The suite runs in plain Node, which is a server context: the marker
    // package is a no-op there. DATABASE_URL comes from the environment the
    // run targets (the Vercel integration's value on development and
    // production, .env.local on a laptop).
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // No local file: the variable must already be in the environment.
    }
    vi.doMock("server-only", () => ({}));

    const { db } = await import("./client");
    const { sql } = await import("drizzle-orm");

    const result = await db.execute(sql`select 1 as ok`);

    expect(result.rows).toEqual([{ ok: 1 }]);
  }, 30_000);

  it("story-accounts-database-environments-ac-2: Importing the database client from a client component fails the build. [bb-sign-in-28]", async () => { // [bb-sign-in-28]
    // A client component's bundle resolves `server-only` to the module that
    // throws; the default resolution (no react-server condition), which is
    // what Vitest uses, is that same module. A valid URL keeps environment
    // validation from being the thing that throws.
    vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");

    await expect(import("./client")).rejects.toThrow(/Client Component/);
  });
});
