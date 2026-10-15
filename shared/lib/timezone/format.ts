// A stored instant as the user reads it: in their timezone, or in UTC while
// the account has none. Only the text depends on the zone; the instant is
// read and never changed.
export function formatInstant(
  instant: Date,
  timezone: string | null | undefined,
): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone ?? "UTC",
  }).format(instant);
}
