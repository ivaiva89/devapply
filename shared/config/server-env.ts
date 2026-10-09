import "server-only";

import { z } from "zod";

// Every variable listed here must also be named in .env.example.
const schema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  // A plain string: Better Auth parses it, and a stricter shape here would
  // reject values it accepts.
  BETTER_AUTH_URL: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  // Optional so PR previews, which have no key, still load. The Resend client
  // refuses to send without it.
  RESEND_API_KEY: z.string().min(1).optional(),
});

// A variable that is set but empty counts as missing.
const set = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => value !== ""),
);

const parsed = schema.safeParse(set);
if (!parsed.success) {
  // Names and reasons only: a value may be a secret, so it is never printed.
  const offending = parsed.error.issues.map((issue) => {
    const name = issue.path.join(".");
    return name in set ? `${name} (${issue.message})` : `${name} (missing)`;
  });
  throw new Error(`Invalid environment variables: ${offending.join(", ")}`);
}

export const env = parsed.data;
