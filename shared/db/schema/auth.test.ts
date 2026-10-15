// @vitest-environment node
import { getTableColumns, getTableName, is } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { beforeAll, describe, expect, it } from "vitest";

import {
  startDatabase,
  type TestDatabase,
} from "@/shared/testing/auth-harness";

// Starting PGlite and applying every migration has its own bound, so a slow
// start fails as a hook timeout and never as the column assertions.
const DATABASE_SETUP_TIMEOUT_MS = 15_000;

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

  describe("on a migrated database", () => {
    let database: TestDatabase;

    beforeAll(async () => {
      database = await startDatabase();
    }, DATABASE_SETUP_TIMEOUT_MS);

    it("story-accounts-timezone-settings-ac-1 (column): The user table has a nullable timezone column with no default, so an existing account starts with no timezone. [F-accounts-13] [bb-sign-in-33]", async () => {
      // [F-accounts-13] [bb-sign-in-33]
      // Every migration in ./drizzle is applied to a real Postgres, the way
      // `pnpm db:migrate` applies them to Neon.
      const { user } = await import("./index");
      expect(Object.keys(getTableColumns(user))).toContain("timezone");

      const { pg } = database;
      const { rows } = await pg.query<{
        data_type: string;
        is_nullable: string;
        column_default: string | null;
      }>(
        `select data_type, is_nullable, column_default
       from information_schema.columns
       where table_schema = 'public' and table_name = 'user'
         and column_name = 'timezone'`,
      );
      expect(rows).toEqual([
        { data_type: "text", is_nullable: "YES", column_default: null },
      ]);

      // An account written the way the tables were before the column existed
      // reads back with no timezone: no default, no backfill.
      await pg.query(
        `insert into "user" (id, name, email) values ('user-1', 'dev', 'dev@example.com')`,
      );
      const stored = await pg.query<{ timezone: string | null }>(
        `select timezone from "user" where id = 'user-1'`,
      );
      expect(stored.rows[0]?.timezone).toBeNull();
    });
  });
});
