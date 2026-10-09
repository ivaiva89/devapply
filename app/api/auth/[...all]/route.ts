// The auth instance is loaded on the first request, not when this module is
// evaluated: `next build` evaluates route modules to collect their config,
// and the instance validates the server env, which a build without secrets
// (CI, `pnpm e2e`) does not have.
async function handler(request: Request): Promise<Response> {
  const { auth } = await import("@/shared/lib/auth/server");
  return auth.handler(request);
}

export { handler as GET, handler as POST };
