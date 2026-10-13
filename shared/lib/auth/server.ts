import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware, isAPIError } from "better-auth/api";

import { env } from "@/shared/config/server-env";
import { db } from "@/shared/db/client";
import { account, session, user, verification } from "@/shared/db/schema";
import { sendEmail } from "@/shared/lib/email/client";
import { confirmEmailTemplate } from "@/shared/lib/email/templates/confirm-email";
import { resetPasswordTemplate } from "@/shared/lib/email/templates/reset-password";

import {
  clearFailedSignIns,
  isSignInLocked,
  recordFailedSignIn,
} from "./lockout";
import { providerCredentials } from "./offered-providers";

const SIGN_UP_PATH = "/sign-up/email";
const SIGN_IN_PATH = "/sign-in/email";
const REQUEST_RESET_PATH = "/request-password-reset";

// Better Auth keeps a reset token as a verification row: this prefix and the
// token as its identifier, the account's user id as its value.
const RESET_IDENTIFIER_PREFIX = "reset-password:";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // One hour is also Better Auth's default; it is stated because the reset
    // pages tell the visitor so.
    resetPasswordTokenExpiresIn: 60 * 60,
    // The emailed link opens our /reset-password page, never Better Auth's
    // GET /reset-password/:token. Only the page's button sends the token to
    // POST /reset-password, which is what uses it up.
    sendResetPassword: async ({ user: recipient, token }) => {
      const link = new URL("/reset-password", env.BETTER_AUTH_URL);
      link.searchParams.set("token", token);
      try {
        await sendEmail({
          to: recipient.email,
          ...resetPasswordTemplate(link.href),
        });
      } catch (error) {
        // An address with no account gets a success and no email. A send that
        // fails must answer the same way, or the error would tell the two
        // apart.
        console.error("Reset email was not sent", error);
      }
    },
    // A reset proves the mailbox is the owner's, so it lifts a sign-in lock.
    onPasswordReset: async ({ user: owner }) => {
      await clearFailedSignIns(owner.email);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    // The emailed link opens our /confirm-email page, never Better Auth's
    // GET /verify-email: mail scanners open links, and only the page's button
    // may use the token up.
    sendVerificationEmail: async ({ user: recipient, token }) => {
      const link = new URL("/confirm-email", env.BETTER_AUTH_URL);
      link.searchParams.set("token", token);
      await sendEmail({
        to: recipient.email,
        ...confirmEmailTemplate(link.href),
      });
    },
  },
  // Google and GitHub, each only where both of its values are set.
  socialProviders: providerCredentials(),
  account: {
    // A social sign-in on an email that already has an account links to it
    // only when the provider reports the email verified and the account's own
    // email is confirmed. Anything else is sent back to the sign-in request's
    // errorCallbackURL with `error=account_not_linked`. That is Better Auth's
    // own check: no provider is trusted here and none of the options that
    // loosen it is set.
    accountLinking: { enabled: true },
  },
  session: {
    // Better Auth's default is 7 days.
    expiresIn: 60 * 60 * 24 * 30,
  },
  rateLimit: {
    // Better Auth turns rate limiting on in production only; the sign-up
    // limit holds everywhere.
    enabled: true,
    // TECH-DEBT: memory storage is per server instance, so on Vercel the
    // 5-per-IP-per-hour limit is not global. A database store needs a
    // rateLimit table and is a later story.
    storage: "memory",
    customRules: {
      [SIGN_UP_PATH]: { window: 60 * 60, max: 5 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const email: unknown = ctx.body?.email;
      if (typeof email !== "string") return;

      // A locked account is refused before the password is checked, so an
      // attempt made during the lock is not counted and cannot extend it.
      // The sign-in form tells this answer from the others by its 423 status.
      if (ctx.path === SIGN_IN_PATH) {
        if (await isSignInLocked(email)) {
          throw new APIError("LOCKED", {
            code: "SIGN_IN_LOCKED",
            message: "Password sign-in is paused for this account.",
          });
        }
        return;
      }

      // Asking for a link again replaces the one before it: the account's
      // earlier reset tokens are removed, so only the newest link works.
      if (ctx.path === REQUEST_RESET_PATH) {
        const found = await ctx.context.internalAdapter.findUserByEmail(
          email.toLowerCase(),
        );
        if (found) {
          await ctx.context.adapter.deleteMany({
            model: "verification",
            where: [
              { field: "value", value: found.user.id },
              {
                field: "identifier",
                operator: "starts_with",
                value: RESET_IDENTIFIER_PREFIX,
              },
            ],
          });
        }
        return;
      }

      // With email verification required, Better Auth answers a repeat sign-up
      // with a generic success. The visitor must see that the address is taken.
      if (ctx.path !== SIGN_UP_PATH) return;
      const existing = await ctx.context.internalAdapter.findUserByEmail(
        email.toLowerCase(),
      );
      if (existing) {
        throw new APIError("UNPROCESSABLE_ENTITY", {
          code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
          message: "User already exists. Use another email.",
        });
      }
    }),
    // Five wrong passwords in a row lock password sign-in on the account; a
    // sign-in that goes through clears the count.
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== SIGN_IN_PATH) return;
      const email: unknown = ctx.body?.email;
      if (typeof email !== "string") return;

      const returned = ctx.context.returned;
      if (isAPIError(returned)) {
        if (returned.body?.code === "INVALID_EMAIL_OR_PASSWORD") {
          await recordFailedSignIn(email);
        }
        return;
      }
      if (ctx.context.newSession) await clearFailedSignIns(email);
    }),
  },
});

// Whether a reset link can still save a password: its token is stored and is
// not past its hour. Asking uses nothing up, so the reset page can be opened
// any number of times before its button is pressed.
export async function isResetTokenUsable(token: string): Promise<boolean> {
  const { internalAdapter } = await auth.$context;
  const stored = await internalAdapter.findVerificationValue(
    `${RESET_IDENTIFIER_PREFIX}${token}`,
  );
  return stored != null && stored.expiresAt >= new Date();
}
