// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  cookieOf,
  createConfirmedUser,
  emptyDatabase,
  loadAuth,
  PASSWORD,
  signInFrom,
} from "@/shared/testing/auth-harness";

// The external boundaries are the database, the mail provider and the
// framework's view of the incoming request and its cache. Better Auth runs for
// real on the Drizzle adapter, so the user rows are in the same Postgres the
// action writes to.
const sendEmail = vi.hoisted(() => vi.fn());
const incoming = vi.hoisted(() => ({ cookie: "" }));
const database = await vi.hoisted(async () => {
  const { startDatabase } = await import("@/shared/testing/auth-harness");
  return startDatabase();
});

vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: database.db }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  updateTag: vi.fn(),
}));
vi.mock("next/headers", () => {
  const jar = () =>
    incoming.cookie
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const at = part.indexOf("=");
        return { name: part.slice(0, at), value: part.slice(at + 1) };
      });
  return {
    headers: async () =>
      new Headers(incoming.cookie ? { cookie: incoming.cookie } : {}),
    cookies: async () => ({
      get: (name: string) => jar().find((entry) => entry.name === name),
      getAll: () => jar(),
      has: (name: string) => jar().some((entry) => entry.name === name),
    }),
  };
});

interface UpdateTimezoneModule {
  updateTimezone: (timezone: string, ...rest: unknown[]) => Promise<unknown>;
}

async function load(): Promise<UpdateTimezoneModule> {
  const specifier = "./update-timezone";
  return (await import(/* @vite-ignore */ specifier)) as UpdateTimezoneModule;
}

interface FormatModule {
  formatInstant: (instant: Date, timezone: string | null | undefined) => string;
}

async function loadFormat(): Promise<FormatModule> {
  const specifier = "../../../shared/lib/timezone/format";
  return (await import(/* @vite-ignore */ specifier)) as FormatModule;
}

let nextAddress = 0;

// A confirmed account, signed in, with the timezone it was given (none for
// null). Returns the Cookie header of that device.
async function signedInAccount(
  email: string,
  timezone: string | null,
): Promise<string> {
  const auth = await loadAuth();
  await createConfirmedUser(auth, sendEmail, email);
  if (timezone !== null) {
    await database.pg.query(
      `update "user" set timezone = $1 where email = $2`,
      [timezone, email],
    );
  }
  nextAddress += 1;
  const response = await signInFrom(
    auth,
    email,
    PASSWORD,
    `198.51.100.${nextAddress}`,
  );
  expect(response.status).toBe(200);
  return cookieOf(response);
}

async function storedTimezone(email: string): Promise<string | null> {
  const { rows } = await database.pg.query<{ timezone: string | null }>(
    `select timezone from "user" where email = $1`,
    [email],
  );
  return rows[0]?.timezone ?? null;
}

// The action may answer with a result or throw for a refusal; what the
// tests hold it to is what ends up stored.
async function attempt(run: () => Promise<unknown>): Promise<void> {
  try {
    await run();
  } catch {
    // A refusal that throws is still a refusal.
  }
}

beforeEach(async () => {
  vi.resetModules();
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  incoming.cookie = "";
  await emptyDatabase(database.pg);
  await database.pg.exec(`truncate table "user" cascade`);

  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv(
    "DATABASE_URL_UNPOOLED",
    "postgresql://user:pass@localhost:5432/db",
  );
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-0000");
  vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  vi.stubEnv("RESEND_API_KEY", "re_test_123");
  vi.stubEnv("EMAIL_FROM", "DevApply <no-reply@devapply.test>");
});

describe("update-timezone", () => {
  it("story-accounts-timezone-settings-ac-8 (save): Settings saves a change of timezone. [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]", async () => {
    // [F-accounts-14] [bb-sign-in-5] [bb-sign-in-13]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");
    const { updateTimezone } = await load();

    await updateTimezone("Asia/Tokyo");
    expect(await storedTimezone("dev@example.com")).toBe("Asia/Tokyo");

    // A confirmed `UTC` can be changed here too, and back.
    await updateTimezone("UTC");
    expect(await storedTimezone("dev@example.com")).toBe("UTC");
    await updateTimezone("America/New_York");
    expect(await storedTimezone("dev@example.com")).toBe("America/New_York");
  });

  it("story-accounts-timezone-settings-ac-8 (last save wins): Two tabs saving different zones in Settings: the last save wins. [F-accounts-14]", async () => {
    // [F-accounts-14]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");
    const { updateTimezone } = await load();

    await updateTimezone("Asia/Tokyo");
    await updateTimezone("America/New_York");

    expect(await storedTimezone("dev@example.com")).toBe("America/New_York");
  });

  it("story-accounts-timezone-settings-ac-9 (settings): A name that is not a valid zone is refused and the saved timezone stays. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");
    const { updateTimezone } = await load();

    for (const bad of ["Not/AZone", "", "Berlin", "Europe/Berlin; --"]) {
      await attempt(() => updateTimezone(bad));
      expect(await storedTimezone("dev@example.com"), bad).toBe(
        "Europe/Berlin",
      );
    }
  });

  it("story-accounts-timezone-settings-ac-10 (stored instants): After a timezone change, a stored date appears in the new zone while the stored instant is unchanged. [F-accounts-15] [bb-sign-in-17]", async () => {
    // [F-accounts-15] [bb-sign-in-17]
    // The account's own created-at stands for any stored instant: 23:30 UTC on
    // the 13th is already the 14th in Berlin and still the 13th in New York.
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");
    await database.pg.query(
      `update "user" set created_at = '2026-10-13T23:30:00Z' where email = $1`,
      ["dev@example.com"],
    );
    const { formatInstant } = await loadFormat();
    const { updateTimezone } = await load();
    const read = async () => {
      const { rows } = await database.pg.query<{
        created_at: Date;
        timezone: string;
      }>(`select created_at, timezone from "user" where email = $1`, [
        "dev@example.com",
      ]);
      const row = rows[0];
      return {
        stored: new Date(row?.created_at ?? 0).toISOString(),
        shown: formatInstant(new Date(row?.created_at ?? 0), row?.timezone),
      };
    };
    const showsDay = (text: string, day: number) =>
      new RegExp(`(^|\\D)0?${day}(\\D|$)`).test(text);

    const before = await read();
    expect(before.stored).toBe("2026-10-13T23:30:00.000Z");
    expect(showsDay(before.shown, 14), before.shown).toBe(true);

    await updateTimezone("America/New_York");

    const after = await read();
    expect(after.stored).toBe(before.stored);
    expect(showsDay(after.shown, 13), after.shown).toBe(true);
    expect(showsDay(after.shown, 14), after.shown).toBe(false);
    expect(after.shown).not.toBe(before.shown);
  });

  it("story-accounts-timezone-settings-ac-14 (settings action): A server action cannot change another account's timezone: the session's user is the only one it reaches, whatever the call names. [bb-sign-in-16]", async () => {
    // [bb-sign-in-16]
    const mine = await signedInAccount("mine@example.com", "Europe/Berlin");
    await signedInAccount("theirs@example.com", "America/New_York");
    incoming.cookie = mine;
    const { updateTimezone } = await load();
    const theirs = (
      await database.pg.query<{ id: string }>(
        `select id from "user" where email = 'theirs@example.com'`,
      )
    ).rows[0]?.id;

    await updateTimezone("Asia/Tokyo");
    // A call that names the other account's id does not reach it either.
    await attempt(() => updateTimezone("Pacific/Auckland", theirs));

    expect(await storedTimezone("theirs@example.com")).toBe("America/New_York");
    expect(await storedTimezone("mine@example.com")).toBe("Asia/Tokyo");
  });
  it("story-accounts-timezone-settings-ac-21 (settings): A name that is not a valid zone, sent straight to the Settings action, returns the refusal the form shows as a field error and the stored timezone is unchanged. (regression pin) [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    incoming.cookie = await signedInAccount("dev@example.com", "Europe/Berlin");
    const { updateTimezone } = await load();

    for (const bad of ["Not/AZone", "", "Berlin", "Europe/Atlantis"]) {
      expect(await updateTimezone(bad), bad).toEqual({
        ok: false,
        error: "Choose a timezone from the list.",
      });
      expect(await storedTimezone("dev@example.com"), bad).toBe(
        "Europe/Berlin",
      );
    }
  });
});
