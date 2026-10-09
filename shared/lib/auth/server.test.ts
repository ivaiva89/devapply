// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

// The external boundaries are the database and the mail provider. The Better
// Auth instance itself runs for real: its own memory adapter stands in for the
// Drizzle adapter, and Resend's client is a spy.
const store = vi.hoisted(() => ({
  user: [] as Record<string, unknown>[],
  session: [] as Record<string, unknown>[],
  account: [] as Record<string, unknown>[],
  verification: [] as Record<string, unknown>[],
}));
const sendEmail = vi.hoisted(() => vi.fn());

vi.mock("server-only", () => ({}));
vi.mock("@/shared/db/client", () => ({ db: {} }));
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
const PASSWORD = "correct-horse-battery";

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

beforeEach(() => {
  vi.resetModules();
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
});

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
});
