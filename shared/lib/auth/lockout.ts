import "server-only";

import { eq, sql } from "drizzle-orm";

import { db } from "@/shared/db/client";
import { signInLockout } from "@/shared/db/schema";

const MAX_FAILURES_IN_A_ROW = 5;
const LOCK_MINUTES = 15;

// Better Auth looks an account up by the lowercased address.
function keyOf(email: string): string {
  return email.toLowerCase();
}

export async function isSignInLocked(email: string): Promise<boolean> {
  const [row] = await db
    .select({ lockedUntil: signInLockout.lockedUntil })
    .from(signInLockout)
    .where(eq(signInLockout.email, keyOf(email)));
  return row?.lockedUntil != null && row.lockedUntil > new Date();
}

// Counts one wrong password. Never called while the lock holds, so an attempt
// made during the lock cannot push its end back.
export async function recordFailedSignIn(email: string): Promise<void> {
  const lockedUntil = new Date(Date.now() + LOCK_MINUTES * 60_000);
  // A lock still on the row has run out, or this attempt would have been
  // refused before the password was checked: the count starts again.
  const failures = sql<number>`case when ${signInLockout.lockedUntil} is null then ${signInLockout.failedAttempts} + 1 else 1 end`;
  await db
    .insert(signInLockout)
    .values({ email: keyOf(email), failedAttempts: 1 })
    .onConflictDoUpdate({
      target: signInLockout.email,
      set: {
        failedAttempts: failures,
        lockedUntil: sql`case when ${failures} >= ${MAX_FAILURES_IN_A_ROW} then ${lockedUntil.toISOString()}::timestamptz else null end`,
      },
    });
}

export async function clearFailedSignIns(email: string): Promise<void> {
  await db.delete(signInLockout).where(eq(signInLockout.email, keyOf(email)));
}
