// @vitest-environment node
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint({ cwd: process.cwd() });

// The same statement in three spellings; the ban is on reading the object.
const READS = [
  "export const url = process.env.DATABASE_URL;",
  'export const url = process.env["DATABASE_URL"];',
  "export const { DATABASE_URL } = process.env;",
];
const CLEAN = "export const url = 1;";

async function messagesFor(filePath: string, code: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((m) => `${m.ruleId}: ${m.message}`);
}

describe("eslint config", () => {
  it("story-accounts-env-module-split-ac-4: Reading `process.env` in application code outside `shared/config` and the root config files fails `pnpm lint`. [bb-sign-in-29]", async () => {
    // [bb-sign-in-29]
    // Application code, in every layer the app has.
    const application = [
      "features/accounts/lib/session.ts",
      "shared/lib/format.ts",
      "shared/db/client.ts",
      "entities/user/model.ts",
      "widgets/header/header.tsx",
      "app/page.tsx",
    ];
    for (const filePath of application) {
      // The file itself lints clean, so a failure below is the read.
      expect(await messagesFor(filePath, CLEAN), filePath).toEqual([]);
      for (const code of READS) {
        expect(
          (await messagesFor(filePath, code)).length,
          `${filePath}: ${code}`,
        ).toBeGreaterThan(0);
      }
    }

    // The places allowed to read it: the env module's folder, the root
    // config files and test files.
    const allowed = [
      "shared/config/server-env.ts",
      "shared/config/other.ts",
      "drizzle.config.ts",
      "next.config.ts",
      "playwright.config.ts",
      "vitest.config.ts",
      "postcss.config.mjs",
      "eslint.config.mjs",
      "shared/db/client.test.ts",
      "features/accounts/lib/session.test.tsx",
      "e2e/app-shell.e2e.test.ts",
    ];
    for (const filePath of allowed) {
      for (const code of READS) {
        expect(
          await messagesFor(filePath, code),
          `${filePath}: ${code}`,
        ).toEqual([]);
      }
    }

    // The files that read it today lint clean as they stand.
    const [drizzle, playwright, client, clientCi, drizzleTest] =
      await eslint.lintFiles([
        "drizzle.config.ts",
        "playwright.config.ts",
        "shared/db/client.test.ts",
        "shared/db/client.ci.test.ts",
        "drizzle.config.test.ts",
      ]);
    for (const result of [drizzle, playwright, client, clientCi, drizzleTest]) {
      expect(result.messages, result.filePath).toEqual([]);
    }
  }, 120_000);
});
