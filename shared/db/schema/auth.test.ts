// @vitest-environment node
import { getTableColumns, getTableName, is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { describe, expect, it } from "vitest";

// What Better Auth's Drizzle adapter reads and writes, by field.
const REQUIRED_COLUMNS = {
  user: ["id", "name", "email", "emailVerified", "createdAt", "updatedAt"],
  session: [
    "id",
    "token",
    "expiresAt",
    "ipAddress",
    "userAgent",
    "userId",
    "createdAt",
    "updatedAt",
  ],
  account: [
    "id",
    "accountId",
    "providerId",
    "userId",
    "password",
    "createdAt",
    "updatedAt",
  ],
  verification: ["id", "identifier", "value", "expiresAt"],
} as const;

describe("auth", () => {
  it("story-accounts-email-sign-up-ac-8: Better Auth's user, session, account and verification tables exist in Neon through a Drizzle migration. [bb-sign-in-32]", async () => {
    // [bb-sign-in-32]
    // Drizzle Kit generates the migration from the schema index, so the
    // tables must be reachable from there.
    const schema = await import("./index");
    const tables = Object.values(schema).filter((value) =>
      is(value, PgTable),
    ) as PgTable[];
    const byName = new Map(tables.map((table) => [getTableName(table), table]));

    for (const [name, columns] of Object.entries(REQUIRED_COLUMNS)) {
      const table = byName.get(name);
      expect(
        table,
        `table "${name}" is registered in the schema`,
      ).toBeDefined();
      expect(Object.keys(getTableColumns(table as PgTable))).toEqual(
        expect.arrayContaining([...columns]),
      );
    }

    // The migrations Drizzle Kit wrote create each of them, so applying them
    // to Neon gives the database those tables. Later stories add migrations of
    // their own; the count is not part of this one's promise.
    const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });
    expect(migrations.length).toBeGreaterThanOrEqual(1);
    const ddl = migrations.flatMap((migration) => migration.sql).join("\n");
    for (const name of Object.keys(REQUIRED_COLUMNS)) {
      expect(ddl).toMatch(
        new RegExp(`create table\\s+("public"\\.)?"${name}"`, "i"),
      );
    }
  });
});
