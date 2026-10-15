import { Suspense, type ReactNode } from "react";

import { currentUserScope } from "@/shared/db/scoped";

import { Sidebar } from "./sidebar";
import { TimezoneSync } from "./timezone-sync";

interface AppShellProps {
  children: ReactNode;
}

// The frame every signed-in page sits in: the sidebar, the main area, and the
// sync that gives an account with no timezone its first one.
export async function AppShell({
  children,
}: AppShellProps): Promise<ReactNode> {
  const scope = await currentUserScope();
  const { timezone } = await scope.readAccount();

  return (
    <div className="bg-canvas flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-8 pt-6 pb-12">
        {/* The sync shows a failed save at the top of the page. It reads the
            address's query, which suspends on a page that is rendered ahead
            of its request. */}
        <Suspense fallback={null}>
          <TimezoneSync timezone={timezone} />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
