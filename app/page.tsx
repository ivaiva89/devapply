import type { ReactNode } from "react";

import { requireCurrentUser } from "@/shared/lib/auth/session";

// The signed-in start page, until tracking-core ships Applications.
export default async function RootPage(): Promise<ReactNode> {
  const user = await requireCurrentUser();

  return (
    <main className="p-6">
      <p className="text-text text-[14px]">Signed in as {user.email}</p>
    </main>
  );
}
