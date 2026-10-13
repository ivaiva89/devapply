import { isValidTimezone } from "./validate";

// The zone the browser reports, `UTC` included, or null when it reports none
// or a name that is not a valid zone. Callers treat null and `UTC` alike: the
// user is asked.
export function detectTimezone(): string | null {
  const zone: unknown = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isValidTimezone(zone) ? zone : null;
}
