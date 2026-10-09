import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { env } from "@/shared/config/server-env";
import { db } from "@/shared/db/client";
import { account, session, user, verification } from "@/shared/db/schema";
import { sendEmail } from "@/shared/lib/email/client";
import { confirmEmailTemplate } from "@/shared/lib/email/templates/confirm-email";

const SIGN_UP_PATH = "/sign-up/email";

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
    // With email verification required, Better Auth answers a repeat sign-up
    // with a generic success. The visitor must see that the address is taken.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== SIGN_UP_PATH) return;
      const email: unknown = ctx.body?.email;
      if (typeof email !== "string") return;
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
  },
});
