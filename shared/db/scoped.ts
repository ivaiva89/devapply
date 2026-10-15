import "server-only";

import { and, eq, type SQL } from "drizzle-orm";

import { requireCurrentUser } from "@/shared/lib/auth/session";

import { user } from "./schema";

interface AccountValues {
  timezone: string;
}

// Every query here carries the session's user as its filter.
export interface UserScope {
  // The user's own account row.
  readAccount: () => Promise<{ timezone: string | null }>;
  // Writes to the user's own account row. `when` can narrow the write to a
  // state of that row; it is added to the user filter and never replaces it.
  updateAccount: (values: AccountValues, when?: SQL) => Promise<void>;
}

// The one way server code reaches the database for a user's data. The user is
// the session's, never an argument, so no caller can name another account. A
// request with no session is sent to sign-in.
export async function currentUserScope(): Promise<UserScope> {
  const { id } = await requireCurrentUser();
  // Loaded here, not at the top: `next build` evaluates this module, and has
  // no environment for the database client to load with.
  const { db } = await import("./client");
  const own = eq(user.id, id);

  return {
    async readAccount() {
      const [row] = await db
        .select({ timezone: user.timezone })
        .from(user)
        .where(own)
        .limit(1);
      return { timezone: row?.timezone ?? null };
    },
    async updateAccount(values, when) {
      await db
        .update(user)
        .set(values)
        .where(when ? and(own, when) : own);
    },
  };
}
