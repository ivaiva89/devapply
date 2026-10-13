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

interface SetFirstTimezoneModule {
  setFirstTimezone: (timezone: string, ...rest: unknown[]) => Promise<unknown>;
}

async function load(): Promise<SetFirstTimezoneModule> {
  const specifier = "./set-first-timezone";
  return (await import(/* @vite-ignore */ specifier)) as SetFirstTimezoneModule;
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

describe("set-first-timezone", () => {
  it("story-accounts-timezone-settings-ac-3 (save): For an account with no timezone, a valid zone is saved. [new] [bb-sign-in-18]", async () => {
    // [new] [bb-sign-in-18]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    expect(await storedTimezone("dev@example.com")).toBeNull();
    const { setFirstTimezone } = await load();

    await setFirstTimezone("Europe/Berlin");

    expect(await storedTimezone("dev@example.com")).toBe("Europe/Berlin");
  });

  it("story-accounts-timezone-settings-ac-4 (keep UTC): Keep UTC saves `UTC` as the account's timezone. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    const { setFirstTimezone } = await load();

    await setFirstTimezone("UTC");

    expect(await storedTimezone("dev@example.com")).toBe("UTC");
  });

  it("story-accounts-timezone-settings-ac-5 (nothing saved): An account that already has a timezone keeps it; the confirm step saves nothing. [new] [bb-sign-in-7]", async () => {
    // [new] [bb-sign-in-7]
    incoming.cookie = await signedInAccount("dev@example.com", "Asia/Tokyo");
    const { setFirstTimezone } = await load();

    await attempt(() => setFirstTimezone("Europe/Berlin"));

    expect(await storedTimezone("dev@example.com")).toBe("Asia/Tokyo");
  });

  it("story-accounts-timezone-settings-ac-6 (UTC stays): A saved `UTC` is a confirmed timezone and is never replaced by a first save. [new]", async () => {
    // [new]
    incoming.cookie = await signedInAccount("dev@example.com", "UTC");
    const { setFirstTimezone } = await load();

    await attempt(() => setFirstTimezone("Europe/Berlin"));

    expect(await storedTimezone("dev@example.com")).toBe("UTC");
  });

  it("story-accounts-timezone-settings-ac-6 (two tabs): Two tabs saving a first timezone: the first save wins and the second changes nothing. [new]", async () => {
    // [new]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    const { setFirstTimezone } = await load();

    await setFirstTimezone("Europe/Berlin");
    await attempt(() => setFirstTimezone("Asia/Tokyo"));

    expect(await storedTimezone("dev@example.com")).toBe("Europe/Berlin");
  });

  it("story-accounts-timezone-settings-ac-9 (first save): A name that is not a valid zone is refused and nothing is saved. [F-accounts-13] [F-accounts-14]", async () => {
    // [F-accounts-13] [F-accounts-14]
    incoming.cookie = await signedInAccount("dev@example.com", null);
    const { setFirstTimezone } = await load();

    for (const bad of ["Not/AZone", "", "Berlin"]) {
      await attempt(() => setFirstTimezone(bad));
      expect(await storedTimezone("dev@example.com"), bad).toBeNull();
    }
  });

  it("story-accounts-timezone-settings-ac-14 (first save): The session's account is the only one a first save can reach, whatever the call names. [bb-sign-in-16]", async () => {
    // [bb-sign-in-16]
    const mine = await signedInAccount("mine@example.com", null);
    await signedInAccount("theirs@example.com", null);
    incoming.cookie = mine;
    const { setFirstTimezone } = await load();
    const theirs = (
      await database.pg.query<{ id: string }>(
        `select id from "user" where email = 'theirs@example.com'`,
      )
    ).rows[0]?.id;

    await setFirstTimezone("Asia/Tokyo");
    // A call that names the other account's id does not reach it either.
    await attempt(() => setFirstTimezone("Asia/Tokyo", theirs));

    expect(await storedTimezone("mine@example.com")).toBe("Asia/Tokyo");
    expect(await storedTimezone("theirs@example.com")).toBeNull();
  });
});
