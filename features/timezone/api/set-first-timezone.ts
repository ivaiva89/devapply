"use server";

import { isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { user } from "@/shared/db/schema";
import { currentUserScope } from "@/shared/db/scoped";
import { isValidTimezone } from "@/shared/lib/timezone/validate";

type SetFirstTimezoneResult = { ok: true } | { ok: false; error: string };

// Gives the session's account its first timezone. The write holds only while
// the account has none, so a timezone that is set, `UTC` included, is never
// replaced here, and of two tabs the first one wins. The second is answered
// as saved: the account has a timezone, which is all its caller waits for.
// The callers send a zone name and nothing else: a call that carries more,
// such as another account's id, did not come from them and is refused whole.
export async function setFirstTimezone(
  timezone: string,
  ...extra: never[]
): Promise<SetFirstTimezoneResult> {
  if (extra.length > 0 || !isValidTimezone(timezone)) {
    return { ok: false, error: "Choose a timezone from the list." };
  }
  const scope = await currentUserScope();
  await scope.updateAccount({ timezone }, isNull(user.timezone));
  // Every signed-in page reads the timezone.
  revalidatePath("/", "layout");
  return { ok: true };
}
