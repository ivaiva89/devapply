// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ageStoredTimestamps,
  cookieOf,
  createConfirmedUser,
  emptyDatabase,
  PASSWORD,
  signInFrom,
} from "@/shared/testing/auth-harness";

// The external boundaries are the database and the mail provider. The Better
// Auth instance itself runs for real: its own memory adapter stands in for the
// Drizzle adapter, Resend's client is a spy, and the sign-in lockout's table
// lives in an in-memory Postgres that has run the repo's migrations.
const store = vi.hoisted(() => ({
  user: [] as Record<string, unknown>[],
  session: [] as Record<string, unknown>[],
  account: [] as Record<string, unknown>[],
  verification: [] as Record<string, unknown>[],
}));
const sendEmail = vi.hoisted(() => vi.fn());
const database = await vi.hoisted(async () => {
  const { startDatabase: start } =
    await import("@/shared/testing/auth-harness");
  return start();
});

vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: database.db }));
vi.mock("better-auth/adapters/drizzle", async () => {
  const { memoryAdapter } = await import("better-auth/adapters/memory");
  return { drizzleAdapter: () => memoryAdapter(store) };
});
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));

const ORIGIN = "http://localhost:3000";
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

interface SentEmail {
  to: string | string[];
  html?: string;
  text?: string;
}

async function loadAuth() {
  const { auth } = await import("./server");
  return auth;
}

async function post(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  path: string,
  body: Record<string, unknown>,
  ip = "203.0.113.7",
) {
  return auth.handler(
    new Request(`${ORIGIN}/api/auth${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: ORIGIN,
        "x-forwarded-for": ip,
      },
      body: JSON.stringify(body),
    }),
  );
}

function signUp(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  email: string,
  ip?: string,
) {
  return post(
    auth,
    "/sign-up/email",
    { email, password: PASSWORD, name: email.split("@")[0] },
    ip,
  );
}

function signIn(auth: Awaited<ReturnType<typeof loadAuth>>, email: string) {
  return post(auth, "/sign-in/email", { email, password: PASSWORD });
}

function sentEmails(): SentEmail[] {
  return sendEmail.mock.calls.map(([payload]) => payload as SentEmail);
}

function recipients(email: SentEmail): string[] {
  return ([] as string[]).concat(email.to);
}

// The link a person would click: the one in the message that opens
// /confirm-email. HTML escapes the query separator, a mail client undoes it.
function confirmationLink(email: SentEmail): URL | undefined {
  const body = [email.html, email.text]
    .filter(Boolean)
    .join("\n")
    .replaceAll("&amp;", "&");
  return (body.match(/https?:\/\/[^\s"'<>)]+/g) ?? [])
    .map((href) => new URL(href))
    .find((url) => url.pathname === "/confirm-email");
}

// The link in a reset email: the one that opens /reset-password. Same
// unescaping as the confirmation link above.
function resetLink(email: SentEmail): URL | undefined {
  const body = [email.html, email.text]
    .filter(Boolean)
    .join("\n")
    .replaceAll("&amp;", "&");
  return (body.match(/https?:\/\/[^\s"'<>)]+/g) ?? [])
    .map((href) => new URL(href))
    .find((url) => url.pathname === "/reset-password");
}

function resetToken(email: SentEmail | undefined): string {
  const token = email ? resetLink(email)?.searchParams.get("token") : null;
  if (!token) throw new Error("no reset link was sent");
  return token;
}

const NEW_PASSWORD = "a-brand-new-password-1";

// Each request comes from its own address, for the same reason as `attempt`.
let nextResetAddress = 0;
function requestReset(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  email: string,
) {
  nextResetAddress += 1;
  return post(
    auth,
    "/request-password-reset",
    { email },
    `203.0.113.${nextResetAddress}`,
  );
}

function saveNewPassword(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  token: string,
  newPassword = NEW_PASSWORD,
) {
  return post(auth, "/reset-password", { newPassword, token });
}

// A confirmed account, and the token of the reset link it asked for.
async function accountWithResetLink(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  email = "dev@example.com",
): Promise<string> {
  await createConfirmedUser(auth, sendEmail, email);
  sendEmail.mockClear();
  const response = await requestReset(auth, email);
  expect(response.status).toBe(200);
  return resetToken(sentEmails().at(-1));
}

beforeEach(async () => {
  vi.resetModules();
  // Only the clock is faked: a session or a lock is a matter of dates.
  vi.useFakeTimers({ toFake: ["Date"] });
  await emptyDatabase(database.pg);
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
  store.user.length = 0;
  store.session.length = 0;
  store.account.length = 0;
  store.verification.length = 0;

  vi.stubEnv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db");
  vi.stubEnv(
    "DATABASE_URL_UNPOOLED",
    "postgresql://user:pass@localhost:5432/db",
  );
  vi.stubEnv("BETTER_AUTH_SECRET", "test-secret-test-secret-test-secret-0000");
  vi.stubEnv("BETTER_AUTH_URL", ORIGIN);
  vi.stubEnv("RESEND_API_KEY", "re_test_123");
  vi.stubEnv("EMAIL_FROM", "DevApply <no-reply@devapply.test>");
  vi.stubEnv("GOOGLE_CLIENT_ID", "google-client-id");
  vi.stubEnv("GOOGLE_CLIENT_SECRET", "google-client-secret");
  vi.stubEnv("GITHUB_CLIENT_ID", "github-client-id");
  vi.stubEnv("GITHUB_CLIENT_SECRET", "github-client-secret");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

// Time passes for the code under test. Stored timestamps move with it, so the
// result does not depend on whether the lock reads the clock in JavaScript or
// in SQL.
function advanceClock(minutes: number): void {
  vi.setSystemTime(new Date(Date.now() + minutes * MINUTE));
}

async function passMinutes(minutes: number): Promise<void> {
  advanceClock(minutes);
  await ageStoredTimestamps(database.pg, minutes);
}

// Each attempt comes from its own address: Better Auth's limiter, which keys
// on the address, is not what is under test.
let nextAddress = 0;
function attempt(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  email: string,
  password: string,
) {
  nextAddress += 1;
  return signInFrom(auth, email, password, `198.51.100.${nextAddress}`);
}

async function failTimes(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  email: string,
  times: number,
) {
  for (let n = 1; n <= times; n += 1) {
    const response = await attempt(auth, email, `wrong-password-${n}`);
    expect(response.status, `failed attempt ${n}`).toBe(401);
  }
}

// ---- Social sign-in ------------------------------------------------------
// Google and GitHub are the external boundary: their token and profile
// endpoints are answered at `fetch`. Better Auth's own sign-in and callback
// run for real. The profiles have the shape the installed providers read
// (node_modules/@better-auth/core/dist/social-providers/google.mjs and
// github.mjs): Google's claims travel in the id token, GitHub's in /user and
// /user/emails. The values are made up.
type SocialProvider = "google" | "github";

interface ProviderAccount {
  // The provider's own id for the person.
  id: string;
  email: string;
  // What the provider says about the address.
  verified: boolean;
  name: string;
}

const GOOGLE_PERSON: ProviderAccount = {
  id: "112233445566778899001",
  email: "dev@example.com",
  verified: true,
  name: "Dev Example",
};
const GITHUB_PERSON: ProviderAccount = {
  id: "4242424",
  email: "dev@example.com",
  verified: true,
  name: "Dev Example",
};

function base64url(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function fetchedUrl(input: unknown): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return (input as Request).url;
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

// Answers what the providers would, for the people given. A call to anywhere
// else fails the test.
function stubProviders(people: {
  google?: ProviderAccount;
  github?: ProviderAccount;
}): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown) => {
      const url = fetchedUrl(input);
      const { google, github } = people;
      if (google && url.startsWith("https://oauth2.googleapis.com/token")) {
        const claims = {
          iss: "https://accounts.google.com",
          aud: "google-client-id",
          sub: google.id,
          email: google.email,
          email_verified: google.verified,
          name: google.name,
          picture: "https://lh3.googleusercontent.example/a/photo",
        };
        return jsonResponse({
          access_token: "google-access-token",
          token_type: "Bearer",
          expires_in: 3599,
          scope: "openid email profile",
          id_token: `${base64url({ alg: "RS256", typ: "JWT" })}.${base64url(claims)}.signature`,
        });
      }
      if (
        github &&
        url.startsWith("https://github.com/login/oauth/access_token")
      ) {
        return jsonResponse({
          access_token: "github-access-token",
          token_type: "bearer",
          scope: "read:user,user:email",
        });
      }
      if (github && url === "https://api.github.com/user") {
        // GitHub leaves `email` empty when the person keeps it private.
        return jsonResponse({
          id: Number(github.id),
          login: "dev-example",
          name: github.name,
          email: null,
          avatar_url: "https://avatars.githubusercontent.example/u/4242424",
        });
      }
      if (github && url === "https://api.github.com/user/emails") {
        return jsonResponse([
          {
            email: github.email,
            primary: true,
            verified: github.verified,
            visibility: "private",
          },
        ]);
      }
      throw new Error(`unexpected request to ${url}`);
    }),
  );
}

// The two requests a browser makes: Better Auth's sign-in request, whose
// answer is the provider's page, and the provider sending the person back
// with a code. Returns the response of that second request.
let nextSocialAddress = 0;
async function signInWith(
  auth: Awaited<ReturnType<typeof loadAuth>>,
  provider: SocialProvider,
  callbackURL = "/",
): Promise<Response> {
  nextSocialAddress += 1;
  const started = await post(
    auth,
    "/sign-in/social",
    { provider, callbackURL, errorCallbackURL: "/sign-in" },
    `198.18.0.${nextSocialAddress}`,
  );
  expect(started.status).toBe(200);
  const { url } = (await started.json()) as { url: string };
  const state = new URL(url).searchParams.get("state");
  expect(state, "the provider's page carries a state").toBeTruthy();

  const back = new URL(`${ORIGIN}/api/auth/callback/${provider}`);
  back.searchParams.set("code", "provider-code");
  back.searchParams.set("state", state as string);
  return auth.handler(
    new Request(back, {
      headers: {
        cookie: cookieOf(started),
        "x-forwarded-for": `198.18.1.${nextSocialAddress}`,
      },
    }),
  );
}

function redirectedTo(response: Response): URL {
  expect(response.status).toBe(302);
  return new URL(response.headers.get("location") ?? "", ORIGIN);
}

function hasSession(response: Response): boolean {
  return response.headers
    .getSetCookie()
    .some((cookie) => cookie.includes("session_token="));
}

function usersWith(email: string) {
  return store.user.filter((row) => row.email === email);
}

function accountsOf(email: string) {
  const [owner] = usersWith(email);
  return store.account.filter((row) => row.userId === owner?.id);
}

describe("server", () => {
  it("story-accounts-email-sign-up-ac-2: Signing up with an email that already has an account shows an error and creates nothing. [F-accounts-1]", async () => {
    // [F-accounts-1]
    const auth = await loadAuth();
    const first = await signUp(auth, "dev@example.com");
    expect(first.status).toBe(200);
    expect(store.user).toHaveLength(1);
    expect(store.account).toHaveLength(1);

    const again = await signUp(auth, "dev@example.com");

    // Better Auth answers a repeat sign-up with a generic success when email
    // verification is required, which would show the visitor no error.
    expect(again.ok).toBe(false);
    expect(store.user).toHaveLength(1);
    expect(store.account).toHaveLength(1);
    expect(store.session).toHaveLength(0);
  });

  it("story-accounts-email-sign-up-ac-3: Sign-up sends a confirmation email whose link opens `/confirm-email`. [F-accounts-2] [bb-sign-in-19]", async () => {
    // [F-accounts-2] [bb-sign-in-19]
    const auth = await loadAuth();

    const response = await signUp(auth, "dev@example.com");

    expect(response.status).toBe(200);
    expect(sentEmails()).toHaveLength(1);
    const [email] = sentEmails();
    expect(recipients(email)).toEqual(["dev@example.com"]);
    const link = confirmationLink(email);
    expect(link?.pathname).toBe("/confirm-email");
    expect(link?.searchParams.get("token")).toBeTruthy();
  });

  it("story-accounts-email-sign-up-ac-5: A sign-in attempt on an unconfirmed account is refused with a message to confirm the email first. [F-accounts-2]", async () => {
    // [F-accounts-2]
    const auth = await loadAuth();
    await signUp(auth, "dev@example.com");

    const refused = await signIn(auth, "dev@example.com");

    expect(refused.status).toBe(403);
    const body = (await refused.json()) as { code?: string; message?: string };
    expect(body.code).toBe("EMAIL_NOT_VERIFIED");
    expect(body.message).toMatch(/confirm|verif/i);
    expect(store.session).toHaveLength(0);

    // The refusal is about the confirmation, not the credentials: using up the
    // emailed link lets the same credentials in.
    const token = confirmationLink(sentEmails()[0])?.searchParams.get("token");
    expect(token).toBeTruthy();
    await auth.api.verifyEmail({ query: { token: token as string } });

    const accepted = await signIn(auth, "dev@example.com");
    expect(accepted.status).toBe(200);
    expect(store.session).toHaveLength(1);
  });

  it("story-accounts-email-sign-up-ac-6 (server): Pressing Resend on `/check-email` sends a new confirmation email. [bb-sign-in-8]", async () => {
    // [bb-sign-in-8]
    const auth = await loadAuth();
    await signUp(auth, "dev@example.com");
    expect(sentEmails()).toHaveLength(1);

    const response = await post(auth, "/send-verification-email", {
      email: "dev@example.com",
    });

    expect(response.status).toBe(200);
    expect(sentEmails()).toHaveLength(2);
    const resent = sentEmails()[1];
    expect(recipients(resent)).toEqual(["dev@example.com"]);
    expect(confirmationLink(resent)?.searchParams.get("token")).toBeTruthy();
    expect(store.user).toHaveLength(1);
  });

  it("story-accounts-email-sign-up-ac-7: The sixth account created from one IP address within an hour is refused. [new] [bb-sign-in-2] [bb-sign-in-34]", async () => {
    // [new] [bb-sign-in-2] [bb-sign-in-34]
    const auth = await loadAuth();
    const ip = "198.51.100.23";

    for (let n = 1; n <= 5; n += 1) {
      const response = await signUp(auth, `dev${n}@example.com`, ip);
      expect(response.status).toBe(200);
    }
    expect(store.user).toHaveLength(5);

    const sixth = await signUp(auth, "dev6@example.com", ip);

    expect(sixth.status).toBe(429);
    expect(store.user).toHaveLength(5);
    expect(store.user.map((user) => user.email)).not.toContain(
      "dev6@example.com",
    );

    // The limit is per address: another IP is not held back by this one.
    const elsewhere = await signUp(auth, "dev6@example.com", "192.0.2.99");
    expect(elsewhere.status).toBe(200);
    expect(store.user).toHaveLength(6);
  });

  it("story-accounts-sign-in-sessions-ac-3: After five failed password sign-ins in a row, password sign-in on that account is refused for 15 minutes with the locked message. [F-accounts-6] [bb-sign-in-3]", async () => {
    // [F-accounts-6] [bb-sign-in-3]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    await createConfirmedUser(auth, sendEmail, "other@example.com");

    await failTimes(auth, "dev@example.com", 5);

    // Even the right password is refused now, and no session is created.
    const locked = await attempt(auth, "dev@example.com", PASSWORD);
    expect(locked.ok).toBe(false);
    expect(store.session).toHaveLength(0);
    // The refusal is not the wrong-password answer: the visitor is told why.
    const refusal = (await locked.json()) as { message?: string };
    expect(refusal.message).not.toMatch(/invalid email or password/i);

    // The lock holds for 14 minutes.
    advanceClock(14);
    const stillLocked = await attempt(auth, "dev@example.com", PASSWORD);
    expect(stillLocked.ok).toBe(false);
    expect(store.session).toHaveLength(0);

    // It is one account's lock: another account signs in meanwhile.
    const other = await attempt(auth, "other@example.com", PASSWORD);
    expect(other.status).toBe(200);

    // Fifteen minutes after it began, the account signs in again.
    await passMinutes(16);
    const reopened = await attempt(auth, "dev@example.com", PASSWORD);
    expect(reopened.status).toBe(200);
    expect(store.session).toHaveLength(2);
  });

  it("story-accounts-sign-in-sessions-ac-3 (sixth attempt): A sixth attempt during the lockout does not extend it. [F-accounts-6] [bb-sign-in-3]", async () => {
    // [F-accounts-6] [bb-sign-in-3]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    await failTimes(auth, "dev@example.com", 5);

    // Pressing on during the lock, with the right password and a wrong one.
    advanceClock(7);
    expect((await attempt(auth, "dev@example.com", PASSWORD)).ok).toBe(false);
    advanceClock(7);
    expect((await attempt(auth, "dev@example.com", "wrong-again")).ok).toBe(
      false,
    );

    // Sixteen minutes after the fifth failure the lock is over, whatever was
    // tried inside it.
    await passMinutes(2);
    const reopened = await attempt(auth, "dev@example.com", PASSWORD);
    expect(reopened.status).toBe(200);
    expect(store.session).toHaveLength(1);
  });

  it("story-accounts-sign-in-sessions-ac-3 (success clears the count): A successful sign-in clears the failed-attempt count, so five failures in a row means five with no success between. [F-accounts-6] [bb-sign-in-3]", async () => {
    // [F-accounts-6] [bb-sign-in-3]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");

    // Four failures, a success, four more: four in a row each time, never
    // eight, so the account is never locked.
    await failTimes(auth, "dev@example.com", 4);
    expect((await attempt(auth, "dev@example.com", PASSWORD)).status).toBe(200);
    await failTimes(auth, "dev@example.com", 4);
    expect((await attempt(auth, "dev@example.com", PASSWORD)).status).toBe(200);
    expect(store.session).toHaveLength(2);

    // The count starts again from zero: five more failures lock it.
    await failTimes(auth, "dev@example.com", 5);
    const locked = await attempt(auth, "dev@example.com", PASSWORD);
    expect(locked.ok).toBe(false);
    expect(store.session).toHaveLength(2);
  });

  it("story-accounts-sign-in-sessions-ac-4: A session stays valid for 30 days without signing in again. [F-accounts-10] [bb-sign-in-15]", async () => {
    // [F-accounts-10] [bb-sign-in-15]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");

    const response = await attempt(auth, "dev@example.com", PASSWORD);
    expect(response.status).toBe(200);

    // The browser is told to keep the cookie for 30 days.
    const sessionCookie = response.headers
      .getSetCookie()
      .find((cookie) => /session_token/.test(cookie));
    expect(sessionCookie).toMatch(new RegExp(`Max-Age=${(30 * DAY) / 1000}`));

    // Twenty-nine days later the same cookie still opens the session.
    const cookie = cookieOf(response);
    vi.setSystemTime(new Date(Date.now() + 29 * DAY));
    const session = await auth.api.getSession({
      headers: new Headers({ cookie }),
    });
    expect(session?.user.email).toBe("dev@example.com");
  });

  it("story-accounts-password-reset-ac-1 (server): `/forgot-password` sends a reset link to a registered email. [F-accounts-7] [bb-sign-in-11]", async () => {
    // [F-accounts-7] [bb-sign-in-11]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    sendEmail.mockClear();

    const response = await requestReset(auth, "dev@example.com");

    expect(response.status).toBe(200);
    expect(sentEmails()).toHaveLength(1);
    const [email] = sentEmails();
    expect(recipients(email)).toEqual(["dev@example.com"]);
    // The link opens the app's own /reset-password page, never an endpoint
    // that would use the token up when a mail scanner opens it.
    const link = resetLink(email);
    expect(link?.origin).toBe(ORIGIN);
    expect(link?.pathname).toBe("/reset-password");
    expect(link?.searchParams.get("token")).toBeTruthy();
  });

  it("story-accounts-password-reset-ac-2 (server): For an email with no account, the same confirmation is returned and nothing is sent. [F-accounts-7]", async () => {
    // [F-accounts-7]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    sendEmail.mockClear();

    const unknown = await requestReset(auth, "nobody@example.com");

    expect(unknown.status).toBe(200);
    expect(sentEmails()).toHaveLength(0);
    expect(
      store.verification.filter((value) =>
        String(value.identifier).startsWith("reset-password:"),
      ),
    ).toHaveLength(0);

    // The answer is the one an address with an account gets, so the response
    // never reveals whether an email has an account.
    const known = await requestReset(auth, "dev@example.com");
    expect(sentEmails()).toHaveLength(1);
    expect(known.status).toBe(unknown.status);
    expect(await known.json()).toEqual(await unknown.json());
  });

  it("story-accounts-password-reset-ac-4 (server): A reset link used once is refused the second time and changes nothing. [F-accounts-8]", async () => {
    // [F-accounts-8]
    const auth = await loadAuth();
    const token = await accountWithResetLink(auth);

    const first = await saveNewPassword(auth, token);
    expect(first.status).toBe(200);
    const second = await saveNewPassword(auth, token, "someone-elses-password");

    expect(second.status).toBe(400);
    expect(((await second.json()) as { code?: string }).code).toBe(
      "INVALID_TOKEN",
    );
    // The refused attempt set no password.
    expect((await attempt(auth, "dev@example.com", NEW_PASSWORD)).status).toBe(
      200,
    );
    expect(
      (await attempt(auth, "dev@example.com", "someone-elses-password")).ok,
    ).toBe(false);
  });

  it("story-accounts-password-reset-ac-4 (newest link only): Two reset requests in a row: only the newest link works. [F-accounts-8]", async () => {
    // [F-accounts-8]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    sendEmail.mockClear();
    expect((await requestReset(auth, "dev@example.com")).status).toBe(200);
    expect((await requestReset(auth, "dev@example.com")).status).toBe(200);
    expect(sentEmails()).toHaveLength(2);
    const [older, newest] = sentEmails().map((email) => resetToken(email));

    const withOlder = await saveNewPassword(auth, older, "older-link-password");
    expect(withOlder.status).toBe(400);
    expect(
      (await attempt(auth, "dev@example.com", "older-link-password")).ok,
    ).toBe(false);

    const withNewest = await saveNewPassword(auth, newest);
    expect(withNewest.status).toBe(200);
  });

  it("story-accounts-password-reset-ac-5 (server): A reset link older than one hour is refused and changes nothing. [F-accounts-9]", async () => {
    // [F-accounts-9]
    const auth = await loadAuth();
    const token = await accountWithResetLink(auth);

    await passMinutes(61);
    const response = await saveNewPassword(auth, token);

    expect(response.status).toBe(400);
    expect(((await response.json()) as { code?: string }).code).toBe(
      "INVALID_TOKEN",
    );
    // The old password is still the account's.
    expect((await attempt(auth, "dev@example.com", PASSWORD)).status).toBe(200);
  });

  it("story-accounts-password-reset-ac-5 (inside the hour): A reset link still works 59 minutes after it was sent. [F-accounts-9]", async () => {
    // [F-accounts-9]
    const auth = await loadAuth();
    const token = await accountWithResetLink(auth);

    await passMinutes(59);
    const response = await saveNewPassword(auth, token);

    expect(response.status).toBe(200);
  });

  it("story-accounts-password-reset-ac-6: After a reset, the new password signs in and the old one does not. [F-accounts-7]", async () => {
    // [F-accounts-7]
    const auth = await loadAuth();
    const token = await accountWithResetLink(auth);

    const saved = await saveNewPassword(auth, token);
    expect(saved.status).toBe(200);

    const withOld = await attempt(auth, "dev@example.com", PASSWORD);
    expect(withOld.ok).toBe(false);
    expect(store.session).toHaveLength(0);
    const withNew = await attempt(auth, "dev@example.com", NEW_PASSWORD);
    expect(withNew.status).toBe(200);
    expect(store.session).toHaveLength(1);
  });

  it("story-accounts-password-reset-ac-6 (locked account): A reset completed while the account is locked lifts the lockout. [F-accounts-7]", async () => {
    // [F-accounts-7]
    const auth = await loadAuth();
    const token = await accountWithResetLink(auth);
    await failTimes(auth, "dev@example.com", 5);
    // The lock holds: even the right password is refused.
    expect((await attempt(auth, "dev@example.com", PASSWORD)).ok).toBe(false);

    const saved = await saveNewPassword(auth, token);
    expect(saved.status).toBe(200);

    // No waiting out the 15 minutes: the new password signs in at once.
    const withNew = await attempt(auth, "dev@example.com", NEW_PASSWORD);
    expect(withNew.status).toBe(200);
    expect(store.session).toHaveLength(1);
  });
  it("story-accounts-social-sign-in-ac-1: Continue with GitHub on sign up or sign in creates an account or signs in. [F-accounts-21] [bb-sign-in-21]", async () => {
    // [F-accounts-21] [bb-sign-in-21]
    const auth = await loadAuth();
    stubProviders({ github: GITHUB_PERSON });

    // First time: an account is created and the person is signed in.
    const first = await signInWith(auth, "github", "/applications");

    expect(redirectedTo(first).pathname).toBe("/applications");
    expect(hasSession(first)).toBe(true);
    expect(usersWith("dev@example.com")).toHaveLength(1);
    const accounts = accountsOf("dev@example.com");
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({
      providerId: "github",
      accountId: GITHUB_PERSON.id,
    });
    expect(store.session).toHaveLength(1);

    // Next time: the same account signs in again, nothing new is created.
    const again = await signInWith(auth, "github");

    expect(redirectedTo(again).pathname).toBe("/");
    expect(hasSession(again)).toBe(true);
    expect(store.user).toHaveLength(1);
    expect(store.account).toHaveLength(1);
    expect(store.session).toHaveLength(2);
  });

  it("story-accounts-social-sign-in-ac-2: Continue with Google on sign up or sign in creates an account or signs in. [F-accounts-3] [bb-sign-in-21]", async () => {
    // [F-accounts-3] [bb-sign-in-21]
    const auth = await loadAuth();
    stubProviders({ google: GOOGLE_PERSON });

    const first = await signInWith(auth, "google", "/applications");

    expect(redirectedTo(first).pathname).toBe("/applications");
    expect(hasSession(first)).toBe(true);
    expect(usersWith("dev@example.com")).toHaveLength(1);
    const accounts = accountsOf("dev@example.com");
    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({
      providerId: "google",
      accountId: GOOGLE_PERSON.id,
    });
    expect(store.session).toHaveLength(1);

    const again = await signInWith(auth, "google");

    expect(redirectedTo(again).pathname).toBe("/");
    expect(hasSession(again)).toBe(true);
    expect(store.user).toHaveLength(1);
    expect(store.account).toHaveLength(1);
    expect(store.session).toHaveLength(2);
  });

  it("story-accounts-social-sign-in-ac-3: Google sign-in on an email that already has a password account links to it when Google reports the email as verified and the account's own email is confirmed. [F-accounts-4] [bb-sign-in-4]", async () => {
    // [F-accounts-4] [bb-sign-in-4]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const [owner] = usersWith("dev@example.com");
    stubProviders({ google: { ...GOOGLE_PERSON, verified: true } });

    const response = await signInWith(auth, "google", "/applications");

    // Signed in as the same person, with Google added to their account.
    expect(redirectedTo(response).pathname).toBe("/applications");
    expect(hasSession(response)).toBe(true);
    expect(store.user).toHaveLength(1);
    expect(store.session).toHaveLength(1);
    expect(store.session[0]).toMatchObject({ userId: owner.id });
    expect(
      accountsOf("dev@example.com")
        .map((row) => row.providerId)
        .sort(),
    ).toEqual(["credential", "google"]);

    // The password still works.
    const withPassword = await signIn(auth, "dev@example.com");
    expect(withPassword.status).toBe(200);
  });

  it("story-accounts-social-sign-in-ac-4: GitHub sign-in on an email that already has an account links to it when GitHub reports the email as verified and the account's own email is confirmed. [F-accounts-22] [bb-sign-in-4]", async () => {
    // [F-accounts-22] [bb-sign-in-4]
    const auth = await loadAuth();
    await createConfirmedUser(auth, sendEmail, "dev@example.com");
    const [owner] = usersWith("dev@example.com");
    stubProviders({ github: { ...GITHUB_PERSON, verified: true } });

    const response = await signInWith(auth, "github", "/applications");

    expect(redirectedTo(response).pathname).toBe("/applications");
    expect(hasSession(response)).toBe(true);
    expect(store.user).toHaveLength(1);
    expect(store.session).toHaveLength(1);
    expect(store.session[0]).toMatchObject({ userId: owner.id });
    expect(
      accountsOf("dev@example.com")
        .map((row) => row.providerId)
        .sort(),
    ).toEqual(["credential", "github"]);

    const withPassword = await signIn(auth, "dev@example.com");
    expect(withPassword.status).toBe(200);
  });

  it("story-accounts-social-sign-in-ac-5 (refused link): A link is refused when the provider reports the email as unverified, and when the account's own email is not confirmed; either way the visitor returns to sign in with the message to use the existing method. [F-accounts-4] [F-accounts-22] [bb-sign-in-4]", async () => {
    // [F-accounts-4] [F-accounts-22] [bb-sign-in-4]
    const auth = await loadAuth();
    const cases: {
      label: string;
      provider: SocialProvider;
      email: string;
      // Whether the person confirmed the address of the password account.
      accountConfirmed: boolean;
      // What the provider says about the address.
      providerVerified: boolean;
    }[] = [
      {
        label: "Google reports the email unverified",
        provider: "google",
        email: "google-unverified@example.com",
        accountConfirmed: true,
        providerVerified: false,
      },
      {
        label: "GitHub reports the email unverified",
        provider: "github",
        email: "github-unverified@example.com",
        accountConfirmed: true,
        providerVerified: false,
      },
      {
        label: "Google verified, the account's email is not confirmed",
        provider: "google",
        email: "google-unconfirmed@example.com",
        accountConfirmed: false,
        providerVerified: true,
      },
      {
        label: "GitHub verified, the account's email is not confirmed",
        provider: "github",
        email: "github-unconfirmed@example.com",
        accountConfirmed: false,
        providerVerified: true,
      },
    ];

    for (const entry of cases) {
      if (entry.accountConfirmed) {
        await createConfirmedUser(auth, sendEmail, entry.email);
      } else {
        nextSocialAddress += 1;
        const signedUp = await signUp(
          auth,
          entry.email,
          `192.0.2.${200 + nextSocialAddress}`,
        );
        expect(signedUp.status, entry.label).toBe(200);
      }
      const person = {
        ...(entry.provider === "google" ? GOOGLE_PERSON : GITHUB_PERSON),
        email: entry.email,
        verified: entry.providerVerified,
      };
      stubProviders({ [entry.provider]: person });
      const sessionsBefore = store.session.length;

      const response = await signInWith(auth, entry.provider, "/applications");

      // Back to sign in, told the account exists; no session, no new user and
      // no provider added to the account.
      const target = redirectedTo(response);
      expect(target.pathname, entry.label).toBe("/sign-in");
      expect(target.searchParams.get("error"), entry.label).toBe(
        "account_not_linked",
      );
      expect(hasSession(response), entry.label).toBe(false);
      expect(store.session, entry.label).toHaveLength(sessionsBefore);
      expect(usersWith(entry.email), entry.label).toHaveLength(1);
      expect(
        accountsOf(entry.email).map((row) => row.providerId),
        entry.label,
      ).toEqual(["credential"]);
    }
  });
});
