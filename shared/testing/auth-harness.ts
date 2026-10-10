// Test support for the auth tests: a real Postgres in memory behind the
// database client, and the sign-up, confirm and sign-in steps a person goes
// through. Better Auth itself runs for real in every test that uses this.
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

export const ORIGIN = "http://localhost:3000";
export const PASSWORD = "correct-horse-battery";

// Better Auth's own tables hold sessions and users in the tests' memory
// adapter; every other table in the migrations belongs to the stories.
const BETTER_AUTH_TABLES = ["user", "session", "account", "verification"];

export interface TestDatabase {
  pg: PGlite;
  db: ReturnType<typeof drizzle>;
}

// Applies every migration in ./drizzle, the way `pnpm db:migrate` does on Neon.
export async function startDatabase(): Promise<TestDatabase> {
  const pg = new PGlite();
  const db = drizzle({ client: pg });
  await migrate(db, { migrationsFolder: "./drizzle" });
  return { pg, db };
}

async function storyTables(pg: PGlite): Promise<string[]> {
  const { rows } = await pg.query<{ tablename: string }>(
    "select tablename from pg_tables where schemaname = 'public'",
  );
  return rows
    .map((row) => row.tablename)
    .filter((name) => !BETTER_AUTH_TABLES.includes(name));
}

export async function emptyDatabase(pg: PGlite): Promise<void> {
  for (const table of await storyTables(pg)) {
    await pg.exec(`truncate table "${table}" cascade`);
  }
}

// Moves every timestamp the stories' tables hold back by some minutes, as if
// that much time had passed since they were written. Used next to a faked
// JavaScript clock so the tests do not depend on which clock the code reads.
export async function ageStoredTimestamps(
  pg: PGlite,
  minutes: number,
): Promise<void> {
  for (const table of await storyTables(pg)) {
    const { rows } = await pg.query<{ column_name: string }>(
      `select column_name from information_schema.columns
       where table_schema = 'public' and table_name = $1
         and data_type like 'timestamp%'`,
      [table],
    );
    for (const { column_name: column } of rows) {
      await pg.exec(
        `update "${table}" set "${column}" = "${column}" - interval '${minutes} minutes'`,
      );
    }
  }
}

// The real Better Auth instance, loaded when a test asks for it so the
// test's own mocks and environment are in place first.
export async function loadAuth(): Promise<AuthLike> {
  const { auth } = await import("@/shared/lib/auth/server");
  return auth as unknown as AuthLike;
}

export interface AuthLike {
  handler: (request: Request) => Promise<Response>;
  api: {
    verifyEmail: (input: { query: { token: string } }) => Promise<unknown>;
  };
}

interface SentEmail {
  html?: string;
  text?: string;
}

export async function post(
  auth: AuthLike,
  path: string,
  body: Record<string, unknown>,
  ip = "203.0.113.7",
  cookie?: string,
): Promise<Response> {
  return auth.handler(
    new Request(`${ORIGIN}/api/auth${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: ORIGIN,
        "x-forwarded-for": ip,
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
  );
}

// One sign-in attempt from one IP address. Better Auth's own limiter keys on
// the address, so each attempt in a run comes from its own.
export function signInFrom(
  auth: AuthLike,
  email: string,
  password: string,
  ip: string,
): Promise<Response> {
  return post(auth, "/sign-in/email", { email, password }, ip);
}

function confirmationToken(email: SentEmail): string | null {
  const body = [email.html, email.text]
    .filter(Boolean)
    .join("\n")
    .replaceAll("&amp;", "&");
  const link = (body.match(/https?:\/\/[^\s"'<>)]+/g) ?? [])
    .map((href) => new URL(href))
    .find((url) => url.pathname === "/confirm-email");
  return link?.searchParams.get("token") ?? null;
}

// Sign-ups are limited per address, and that limit outlives a test's module
// reset, so every sign-up here comes from an address of its own.
let nextSignUpAddress = 0;

// A person who signed up and used up the emailed link: the confirmed user the
// sign-in stories start from.
export async function createConfirmedUser(
  auth: AuthLike,
  sendEmail: { mock: { calls: unknown[][] } },
  email: string,
): Promise<void> {
  nextSignUpAddress += 1;
  const signedUp = await post(
    auth,
    "/sign-up/email",
    { email, password: PASSWORD, name: email.split("@")[0] },
    `192.0.2.${nextSignUpAddress}`,
  );
  if (signedUp.status !== 200) {
    throw new Error(`sign-up failed with ${signedUp.status}`);
  }
  const sent = sendEmail.mock.calls.at(-1)?.[0] as SentEmail | undefined;
  const token = sent ? confirmationToken(sent) : null;
  if (!token) throw new Error("no confirmation link was sent");
  await auth.api.verifyEmail({ query: { token } });
}

// The Cookie header a browser sends after a response set these cookies.
export function cookieOf(response: Response): string {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}
