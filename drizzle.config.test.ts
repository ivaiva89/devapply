// @vitest-environment node
import { spawn } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

// Hosts that never resolve, so a migration attempt against them always fails.
// Which variable a run was built from shows in its outcome: a run that has a
// URL reaches drizzle-kit's "applying migrations" step, one that has none
// stops naming the variable. The password is unique so a leak is findable.
const PASSWORD = "hunter2-sekret";
const url = (host: string) =>
  `postgresql://migrator:${PASSWORD}@${host}:5432/db`;

// Nothing a run prints may carry the database credentials.
function assertNoCredentials(output: string) {
  expect(output).not.toContain(PASSWORD);
}

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

// What `next build` needs: the app itself, and the root files its type check
// reads (`vitest.setup.ts` for the test matchers, `drizzle.config.ts` because
// a test imports it).
const BUILD_FILES = [
  "package.json",
  "tsconfig.json",
  "drizzle.config.ts",
  "next.config.ts",
  "postcss.config.mjs",
  "proxy.ts",
  "components.json",
  "vitest.setup.ts",
  "app",
  "features",
  "entities",
  "widgets",
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
  return dir;
}

// A copy of the app to build where no .env or .env.local exists, so a build
// sees only the variables a case passes. It sits under the repo's ignored
// `.worktrees/` folder, not the system temp folder: Turbopack refuses a
// `node_modules` symlink that points outside the folder it treats as the
// project root, and inside the repo that root is the repo.
function makeBuildSandbox(): string {
  const parent = join(process.cwd(), ".worktrees");
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(join(parent, "devapply-build-"));
  sandboxes.push(dir);
  for (const file of BUILD_FILES) {
    cpSync(join(process.cwd(), file), join(dir, file), { recursive: true });
  }
  symlinkSync(join(process.cwd(), "node_modules"), join(dir, "node_modules"));
  return dir;
}

// The route each page and route handler under `app/` serves: a folder in
// parentheses groups routes and is not part of the path.
function appRoutes(appDir: string): string[] {
  const routes: string[] = [];
  const walk = (dir: string, segments: string[]) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const grouped = /^\(.*\)$/.test(entry.name);
        walk(
          join(dir, entry.name),
          grouped ? segments : [...segments, entry.name],
        );
      } else if (/^(page|route)\.tsx?$/.test(entry.name)) {
        routes.push(`/${segments.join("/")}`);
      }
    }
  };
  walk(appDir, []);
  return routes;
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
      done({ code, output, nextStarted });
    });
  });
}

function vercelBuildCommand(dir: string): string {
  const config = JSON.parse(readFileSync(join(dir, "vercel.json"), "utf8"));
  return config.buildCommand;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const REACHED_MIGRATION = /applying migrations/;

describe("drizzle.config", () => {
  it("story-accounts-migrate-in-vercel-build-ac-1: `pnpm build` with no database variable set builds the app without running a migration, so `pnpm e2e` passes on a machine with no database. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    // A copy of the app with no .env.local: in the real repo Next would read
    // the developer's own, and this case could not fail on their machine.
    const { code, output } = await run(
      "pnpm build",
      makeBuildSandbox(),
      {},
      {
        stopAtNext: false,
      },
    );

    expect(output).not.toMatch(/drizzle-kit|applying migrations/);
    expect(code, output).toBe(0);
  }, 180_000);

  it("story-bug-build-fails-without-server-env-ac-1: `pnpm build` with no `.env.local` and none of the server variables set builds every route and exits 0.", async () => {
    const dir = makeBuildSandbox();

    const { code, output } = await run(
      "pnpm build",
      dir,
      {},
      {
        stopAtNext: false,
      },
    );

    expect(output).not.toMatch(/Invalid environment variables/);
    expect(code, output).toBe(0);
    // The build lists each route it built, one per line.
    const built = output.split("\n").map((line) => line.trimEnd());
    const routes = appRoutes(join(dir, "app"));
    expect(routes).toContain("/reset-password");
    for (const route of routes) {
      expect(
        built.some((line) => line.endsWith(` ${route}`)),
        `${route} is built`,
      ).toBe(true);
    }
  }, 180_000);

  it("story-accounts-migrate-in-vercel-build-ac-2: The build command in `vercel.json` applies pending migrations before `next build`; against an unreachable database it fails with drizzle-kit's own error in the output and `next build` never starts. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    const dir = makeSandbox();

    const { code, nextStarted, output } = await run(
      vercelBuildCommand(dir),
      dir,
      { DATABASE_URL_UNPOOLED: url("direct.invalid") },
    );

    // drizzle-kit started and got as far as applying migrations.
    expect(output).toMatch(/Reading config file/);
    expect(output).toMatch(REACHED_MIGRATION);
    expect(code).not.toBe(0);
    expect(nextStarted, output).toBe(false);
    assertNoCredentials(output);
  }, 120_000);

  it("story-accounts-migrate-in-vercel-build-ac-3: The migration step connects with `DATABASE_URL_UNPOOLED` and ignores `DATABASE_URL`. [bb-sign-in-28]", async () => {
    // [bb-sign-in-28]
    vi.stubEnv("DATABASE_URL", url("pooled.invalid"));
    vi.stubEnv("DATABASE_URL_UNPOOLED", url("direct.invalid"));
    vi.resetModules();

    const { default: config } = await import("./drizzle.config");

    const credentials = (config as { dbCredentials: { url: string } })
      .dbCredentials;
    expect(credentials.url).toBe(url("direct.invalid"));
  });

  it("story-accounts-migrate-in-vercel-build-ac-4: With `DATABASE_URL_UNPOOLED` unset, the migration step stops with an error naming that variable, and `next build` never starts. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    const dir = makeSandbox();

    // DATABASE_URL is set: it must not stand in for the missing variable.
    const { code, nextStarted, output } = await run(
      vercelBuildCommand(dir),
      dir,
      { DATABASE_URL: url("pooled.invalid") },
    );

    expect(code).not.toBe(0);
    expect(output).toMatch(/DATABASE_URL_UNPOOLED/);
    expect(output).not.toMatch(REACHED_MIGRATION);
    expect(nextStarted, output).toBe(false);
    assertNoCredentials(output);
  }, 120_000);

  it("story-accounts-migrate-in-vercel-build-ac-5: `pnpm db:migrate` and `pnpm db:generate` read `DATABASE_URL_UNPOOLED` from `.env.local` when it is not already in the shell. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    // The winner is told by outcome: a run holding a URL reaches "applying
    // migrations", one holding none stops naming the variable. The losing
    // source always holds an empty value, so only the winner can supply one.

    // .env.local alone.
    const fileOnly = await run(
      "pnpm db:migrate",
      makeSandbox({
        ".env.local": `DATABASE_URL_UNPOOLED=${url("local-file.invalid")}\n`,
      }),
      {},
    );
    expect(fileOnly.output).toMatch(REACHED_MIGRATION);
    expect(fileOnly.output).not.toMatch(/Missing environment variable/);
    assertNoCredentials(fileOnly.output);

    // A legacy .env (Neon Local, Prisma) beside .env.local: drizzle-kit loads
    // it by itself, and the .env.local value must win over it.
    const overLegacy = await run(
      "pnpm db:migrate",
      makeSandbox({
        ".env.local": `DATABASE_URL_UNPOOLED=${url("local-file.invalid")}\n`,
        ".env": "DATABASE_URL_UNPOOLED=\n",
      }),
      {},
    );
    expect(overLegacy.output).toMatch(REACHED_MIGRATION);
    assertNoCredentials(overLegacy.output);

    // A value already in the shell wins over .env.local.
    const overFile = await run(
      "pnpm db:migrate",
      makeSandbox({ ".env.local": "DATABASE_URL_UNPOOLED=\n" }),
      { DATABASE_URL_UNPOOLED: url("shell.invalid") },
    );
    expect(overFile.output).toMatch(REACHED_MIGRATION);
    assertNoCredentials(overFile.output);

    // No .env.local and nothing in the shell: it falls back to the shell and
    // says which variable is missing.
    const nothing = await run("pnpm db:migrate", makeSandbox(), {});
    expect(nothing.code).not.toBe(0);
    expect(nothing.output).toMatch(/DATABASE_URL_UNPOOLED/);
    expect(nothing.output).not.toMatch(REACHED_MIGRATION);
    assertNoCredentials(nothing.output);

    // db:generate never connects, so it shows the variable was found by
    // loading the config: it runs through instead of stopping on a missing
    // variable.
    const generated = await run(
      "pnpm db:generate",
      makeSandbox({
        ".env.local": `DATABASE_URL_UNPOOLED=${url("local-file.invalid")}\n`,
      }),
      {},
    );
    expect(generated.output).not.toMatch(/Missing environment variable/);
    expect(generated.code, generated.output).toBe(0);
    assertNoCredentials(generated.output);
  }, 240_000);

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

  it("story-accounts-env-module-split-ac-3: `drizzle-kit generate` and `drizzle-kit migrate` run with only their own database URL set, whatever other variables the server env module requires. [bb-sign-in-28] (regression pin)", async () => {
    // [bb-sign-in-28]
    // Only DATABASE_URL_UNPOOLED is set: no other variable the app needs
    // (today DATABASE_URL, later whatever the server env module adds) may be
    // required by a run that loads drizzle.config.ts. The sandbox holds a
    // copy of shared/, so a config that reached the env module would stop
    // here on the first variable it needs.
    const own = { DATABASE_URL_UNPOOLED: url("direct.invalid") };

    const generated = await run("pnpm db:generate", makeSandbox(), own);
    expect(generated.output).not.toMatch(
      /Missing environment variable|Invalid environment|Client Component/,
    );
    expect(generated.code, generated.output).toBe(0);
    assertNoCredentials(generated.output);

    const migrated = await run("pnpm db:migrate", makeSandbox(), own);
    expect(migrated.output).toMatch(REACHED_MIGRATION);
    expect(migrated.output).not.toMatch(
      /Missing environment variable|Invalid environment|Client Component/,
    );
    assertNoCredentials(migrated.output);
  }, 240_000);
});
