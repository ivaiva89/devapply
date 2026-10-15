import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { auth } from "./server";

// Better Auth's browser client. It talks to /api/auth on the page's own
// origin, so it needs no configuration and no secret reaches the client. The
// plugin only gives the client the server's extra user fields as types: the
// import above is erased, so no server code is bundled.
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
