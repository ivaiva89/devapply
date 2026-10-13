// The app's default route, until tracking-core ships Applications.
const DEFAULT_ROUTE = "/";

// On the server there is no address to compare with, so a stand-in origin is
// used. Only the path is ever returned, so naming the stand-in gains nothing.
const SERVER_ORIGIN = "http://devapply.invalid";

// Where to go back to: the route asked for when it is a place on this site.
// Anything that resolves to another origin, and no route at all, is the
// default route.
export function returnPath(requested: string | undefined): string {
  const origin =
    typeof window === "undefined" ? SERVER_ORIGIN : window.location.origin;
  if (!requested || !URL.canParse(requested, origin)) return DEFAULT_ROUTE;
  const url = new URL(requested, origin);
  if (url.origin !== origin) return DEFAULT_ROUTE;
  // "/.//host" resolves to the path "//host", which a browser reads as
  // another site.
  if (url.pathname.startsWith("//")) return DEFAULT_ROUTE;
  return `${url.pathname}${url.search}${url.hash}`;
}
