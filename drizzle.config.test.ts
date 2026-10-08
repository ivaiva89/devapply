// @vitest-environment node
import { spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

// Hosts that never resolve: any migration attempt against them fails, and the
// host an attempt reaches for tells which variable it was built from.
const url = (host: string) => `postgresql://user:pass@${host}:5432/db`;

// The repo files a migration run needs, copied into a throwaway directory so
// a developer's own .env and .env.local can never leak into a case, and a
// case can write its own.
const SANDBOX_FILES = [
  "package.json",
  "vercel.json",
  "drizzle.config.ts",
  "tsconfig.json",
  "drizzle",
  "shared",
];

const sandboxes: string[] = [];

function makeSandbox(dotenv: Record<string, string> = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "devapply-migrate-"));
  sandboxes.push(dir);
  for (const file of SANDBOX_FILES) {
    cpSync(join(process.cwd(), file), join(dir, file), { recursive: true });
  }
  symlinkSync(join(process.cwd(), "node_modules"), join(dir, "node_modules"));
  for (const [name, contents] of Object.entries(dotenv)) {
    writeFileSync(join(dir, name), contents);
  }
  // Records the host of every socket the run opens: the network is the
  // external boundary, so this watches the connection without replacing it.
  writeFileSync(
    join(dir, "spy.mjs"),
    [
      'import { appendFileSync } from "node:fs";',
      'import net from "node:net";',
      "const connect = net.Socket.prototype.connect;",
      "net.Socket.prototype.connect = function (...args) {",
      '  const target = typeof args[0] === "object" && args[0] ? args[0] : {};',
      '  if (target.host) appendFileSync(new URL("./connections.log", import.meta.url), target.host + "\\n");',
      "  return connect.apply(this, args);",
      "};",
    ].join("\n"),
  );
  return dir;
}

afterEach(() => {
  for (const dir of sandboxes.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

type Run = {
  code: number | null;
  output: string;
  nextStarted: boolean;
  hosts: string[];
};

function run(
  command: string,
  cwd: string,
  env: Record<string, string>,
  { stopAtNext = true }: { stopAtNext?: boolean } = {},
): Promise<Run> {
  return new Promise((done) => {
    const child = spawn("sh", ["-c", command], {
      cwd,
      detached: true,
      // Only what is listed here reaches the run, so a database variable in
      // the developer's shell cannot change the answer. Next's ProcessEnv type
      // requires NODE_ENV, which a build must pick for itself, so the object
      // is cast rather than given one.
      env: {
        PATH: process.env.PATH,
        HOME: process.env.HOME,
        CI: "1",
        ...(existsSync(join(cwd, "spy.mjs"))
          ? {
              NODE_OPTIONS: `--import=${pathToFileURL(join(cwd, "spy.mjs")).href}`,
            }
          : {}),
        ...env,
      } as unknown as NodeJS.ProcessEnv,
    });
    let output = "";
    let nextStarted = false;
    const onData = (chunk: Buffer) => {
      output += chunk.toString();
      if (!nextStarted && /Next\.js/.test(output)) {
        nextStarted = true;
        // `next build` began: stop it, the answer is already known.
        if (stopAtNext && child.pid) process.kill(-child.pid, "SIGKILL");
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    const watchdog = setTimeout(() => {
      if (child.pid) process.kill(-child.pid, "SIGKILL");
    }, 90_000);
    child.on("close", (code) => {
      clearTimeout(watchdog);
      const log = join(cwd, "connections.log");
      const hosts = existsSync(log)
        ? readFileSync(log, "utf8").split("\n").filter(Boolean)
        : [];
      done({ code, output, nextStarted, hosts });
    });
  });
}

function vercelBuildCommand(dir: string): string {
  const config = JSON.parse(readFileSync(join(dir, "vercel.json"), "utf8"));
  return config.buildCommand;
}

describe("drizzle.config", () => {
  it("story-accounts-migrate-in-vercel-build-ac-1: `pnpm build` with no database variable set builds the app without running a migration, so `pnpm e2e` passes on a machine with no database. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    // The real repo, not a sandbox: this is the build `pnpm e2e` runs.
    const { code, output } = await run(
      "pnpm build",
      process.cwd(),
      {},
      {
        stopAtNext: false,
      },
    );

    expect(output).not.toMatch(/drizzle-kit|applying migrations/);
    expect(code, output).toBe(0);
  }, 180_000);

  it("story-accounts-migrate-in-vercel-build-ac-2: The build command in `vercel.json` applies pending migrations before `next build`; against an unreachable database it fails with drizzle-kit's own error in the output and `next build` never starts. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    const dir = makeSandbox();
    const buildCommand = vercelBuildCommand(dir);

    const { code, nextStarted, output, hosts } = await run(buildCommand, dir, {
      DATABASE_URL_UNPOOLED: url("direct.invalid"),
    });

    // drizzle-kit started and reached for the database before anything else.
    expect(output).toMatch(/Reading config file/);
    expect(hosts).toContain("direct.invalid");
    expect(code).not.toBe(0);
    expect(nextStarted, output).toBe(false);
  }, 120_000);

  it("story-accounts-migrate-in-vercel-build-ac-3: The migration step connects with `DATABASE_URL_UNPOOLED` and ignores `DATABASE_URL`. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    const dir = makeSandbox();

    const { hosts, output } = await run(vercelBuildCommand(dir), dir, {
      DATABASE_URL: url("pooled.invalid"),
      DATABASE_URL_UNPOOLED: url("direct.invalid"),
    });

    expect(hosts, output).toContain("direct.invalid");
    expect(hosts).not.toContain("pooled.invalid");
  }, 120_000);

  it("story-accounts-migrate-in-vercel-build-ac-4: With `DATABASE_URL_UNPOOLED` unset, the migration step stops with an error naming that variable, and `next build` never starts. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    const dir = makeSandbox();

    // DATABASE_URL is set: it must not stand in for the missing variable.
    const { code, nextStarted, output, hosts } = await run(
      vercelBuildCommand(dir),
      dir,
      { DATABASE_URL: url("pooled.invalid") },
    );

    expect(code).not.toBe(0);
    expect(output).toMatch(/DATABASE_URL_UNPOOLED/);
    expect(hosts).not.toContain("pooled.invalid");
    expect(nextStarted, output).toBe(false);
  }, 120_000);

  it("story-accounts-migrate-in-vercel-build-ac-5: `pnpm db:migrate` and `pnpm db:generate` read `DATABASE_URL_UNPOOLED` from `.env.local` when it is not already in the shell. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    // A legacy .env (Neon Local, Prisma) sits beside .env.local and
    // drizzle-kit loads it by itself: the .env.local value must win over it.
    const dir = makeSandbox({
      ".env.local": `DATABASE_URL_UNPOOLED=${url("local-file.invalid")}\n`,
      ".env": `DATABASE_URL_UNPOOLED=${url("legacy-env.invalid")}\nDATABASE_URL=${url("legacy-pooled.invalid")}\n`,
    });

    const fromFile = await run("pnpm db:migrate", dir, {});
    expect(fromFile.hosts, fromFile.output).toContain("local-file.invalid");
    expect(fromFile.hosts).not.toContain("legacy-env.invalid");
    expect(fromFile.hosts).not.toContain("legacy-pooled.invalid");

    // A value already in the shell wins over the file.
    const fromShell = await run("pnpm db:migrate", dir, {
      DATABASE_URL_UNPOOLED: url("shell.invalid"),
    });
    expect(fromShell.hosts, fromShell.output).toContain("shell.invalid");
    expect(fromShell.hosts).not.toContain("local-file.invalid");

    // db:generate never connects, so it shows the variable was found by
    // loading the config: it runs through instead of stopping on a missing
    // variable.
    const generateDir = makeSandbox({
      ".env.local": `DATABASE_URL_UNPOOLED=${url("local-file.invalid")}\n`,
    });
    const generated = await run("pnpm db:generate", generateDir, {});
    expect(generated.output).not.toMatch(/Missing environment variable/);
    expect(generated.code, generated.output).toBe(0);
  }, 180_000);

  it("story-accounts-migrate-in-vercel-build-ac-6: `.env.example` lists `DATABASE_URL_UNPOOLED` by name only. [bb-sign-in-29]", () => {
    // [bb-sign-in-29]
    const lines = readFileSync(join(process.cwd(), ".env.example"), "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"));

    // Name only: no value after the equals sign.
    expect(lines).toContain("DATABASE_URL_UNPOOLED=");
    for (const line of lines) {
      expect(line).toMatch(/^[A-Z][A-Z0-9_]*=(""|)$/);
    }
  });
});
