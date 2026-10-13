import type { ReactNode } from "react";

import { requireCurrentUser } from "@/shared/lib/auth/session";
import { AppShell } from "@/widgets/app-shell/ui/app-shell";

// The signed-in start page, until tracking-core ships Applications. It stays
// outside the `(app)` group, so it puts itself in the shell.
export default async function RootPage(): Promise<ReactNode> {
  const user = await requireCurrentUser();

  return (
    <AppShell>
      <p className="text-text text-[14px]">Signed in as {user.email}</p>
    </AppShell>
  );
}
