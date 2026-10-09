import "server-only";

import { z } from "zod";

// Every variable listed here must also be named in .env.example.
const schema = z.object({
  DATABASE_URL: z.url(),
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
