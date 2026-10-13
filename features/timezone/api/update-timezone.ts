"use server";

import { revalidatePath } from "next/cache";

import { currentUserScope } from "@/shared/db/scoped";
import { isValidTimezone } from "@/shared/lib/timezone/validate";

type UpdateTimezoneResult = { ok: true } | { ok: false; error: string };

// Saves the timezone picked in Settings on the session's account, whatever it
// was before. Of two saves the last one wins. The form sends a zone name and
// nothing else: a call that carries more, such as another account's id, did
// not come from it and is refused whole.
export async function updateTimezone(
  timezone: string,
  ...extra: never[]
): Promise<UpdateTimezoneResult> {
  if (extra.length > 0 || !isValidTimezone(timezone)) {
    return { ok: false, error: "Choose a timezone from the list." };
  }
  const scope = await currentUserScope();
  await scope.updateAccount({ timezone });
  // Every signed-in page reads the timezone.
  revalidatePath("/", "layout");
  return { ok: true };
}
