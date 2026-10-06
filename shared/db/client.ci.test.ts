// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

type JsonAssertion = {
  fullName: string;
  status: string;
  failureMessages: string[];
};

type JsonReport = {
  testResults: { assertionResults: JsonAssertion[] }[];
};

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

describe("client in CI", () => {
  it("story-bug-ci-red-on-development-ac-2: With DATABASE_URL absent and no .env.local to read, running shared/db/client.test.ts exits 0, skips the live-database case and passes the server-only case.", () => {
    // CI has no DATABASE_URL and no .env.local. Reproduce that: strip the
    // variable (and the parent run's own Vitest markers) from the child's
    // environment, and start the child in an empty directory so the
    // `.env.local` load, which is relative to the working directory, finds
    // nothing. --root and --config keep it pointed at this repo.
    const env = { ...process.env };
    delete env.DATABASE_URL;
    for (const key of Object.keys(env)) {
      if (key.startsWith("VITEST")) delete env[key];
    }
    const emptyDir = mkdtempSync(path.join(tmpdir(), "client-ci-"));

    const reportPath = path.join(emptyDir, "report.json");

    let child: ReturnType<typeof spawnSync>;
    let report: JsonReport;
    try {
      child = spawnSync(
        process.execPath,
        [
          path.join(repoRoot, "node_modules/vitest/vitest.mjs"),
          "run",
          "--root",
          repoRoot,
          "--config",
          path.join(repoRoot, "vitest.config.ts"),
          "--reporter=json",
          `--outputFile=${reportPath}`,
          "shared/db/client.test.ts",
        ],
        { cwd: emptyDir, env, encoding: "utf8", timeout: 90_000 },
      );
      report = JSON.parse(readFileSync(reportPath, "utf8")) as JsonReport;
    } finally {
      rmSync(emptyDir, { recursive: true, force: true });
    }

    const assertions = report.testResults.flatMap((r) => r.assertionResults);
    const ac1 = assertions.find((a) =>
      a.fullName.includes("story-accounts-database-environments-ac-1"),
    );
    const ac2 = assertions.find((a) =>
      a.fullName.includes("story-accounts-database-environments-ac-2"),
    );

    // Before the fix the child fails here with "Missing environment
    // variable: DATABASE_URL". Any other failure means the child read a
    // laptop's .env.local, and the run is not CI's environment.
    expect(assertions.flatMap((a) => a.failureMessages)).toEqual([]);
    expect(ac1?.status).toBe("skipped");
    expect(ac2?.status).toBe("passed");
    expect(child.status).toBe(0);
  }, 120_000);
});
