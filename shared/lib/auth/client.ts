import { createAuthClient } from "better-auth/react";

// Better Auth's browser client. It talks to /api/auth on the page's own
// origin, so it needs no configuration and no secret reaches the client.
export const authClient = createAuthClient();
