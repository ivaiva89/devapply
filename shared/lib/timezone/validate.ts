// Whether a value is the name of a real IANA zone, `UTC` included. The
// runtime's own zone data decides, so no list is kept here.
export function isValidTimezone(value: unknown): value is string {
  // Intl also takes a bare offset such as "+01:00". A zone name starts with a
  // letter, and only a name is stored.
  if (typeof value !== "string" || !/^[A-Za-z]/.test(value)) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
