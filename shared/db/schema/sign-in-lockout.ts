import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// One row per email that has failed password sign-ins since its last success.
// The key is the email as it was typed at sign-in, lowercased, so an address
// with no account locks the same way and a lock never says an account exists.
export const signInLockout = pgTable("sign_in_lockout", {
  email: text("email").primaryKey(),
  failedAttempts: integer("failed_attempts").notNull(),
  // Set by the fifth failure in a row; null while the count is still running.
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
});
