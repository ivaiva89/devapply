// @vitest-environment node
import { spawn } from "node:child_process";
import { describe, expect, it } from "vitest";

// A database nothing listens on: any migration attempt against it fails.
const DEAD_DATABASE_URL = "postgresql://user:pass@127.0.0.1:1/db";

function runBuild(databaseUrl?: string): Promise<{
  code: number | null;
  output: string;
  nextStarted: boolean;
}> {
  return new Promise((done) => {
    const child = spawn("pnpm", ["build"], {
      cwd: process.cwd(),
      detached: true,
      // Every database variable a migration could pick up points at the dead
      // database, so this run can never touch a real one.
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        CI: "1",
        // Left out entirely when the case is a missing DATABASE_URL.
        ...(databaseUrl === undefined ? {} : { DATABASE_URL: databaseUrl }),
        DATABASE_URL_UNPOOLED: DEAD_DATABASE_URL,
        DIRECT_URL: DEAD_DATABASE_URL,
        // Next's ProcessEnv type requires NODE_ENV, which a build must pick
        // for itself, so the object is cast rather than given one.
      } as unknown as NodeJS.ProcessEnv,
    });
    let output = "";
    let nextStarted = false;
    const onData = (chunk: Buffer) => {
      output += chunk.toString();
      if (!nextStarted && /Next\.js/.test(output)) {
        // `next build` began: stop it, the answer is already known.
        nextStarted = true;
        if (child.pid) process.kill(-child.pid, "SIGKILL");
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("close", (code) => done({ code, output, nextStarted }));
  });
}

describe("drizzle.config", () => {
  it("story-accounts-database-environments-ac-3: Every Vercel build applies pending Drizzle migrations to its own database before `next build`, and a failing migration fails the build. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    const { code, nextStarted, output } = await runBuild(DEAD_DATABASE_URL);

    expect(nextStarted, output).toBe(false);
    expect(code).not.toBe(0);
  }, 120_000);

  it("story-accounts-database-environments-ac-5: A missing `DATABASE_URL` stops the build with an error naming the variable. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    const { code, nextStarted, output } = await runBuild(undefined);

    expect(nextStarted, output).toBe(false);
    expect(code).not.toBe(0);
    expect(output).toMatch(/DATABASE_URL/);
  }, 120_000);
});
