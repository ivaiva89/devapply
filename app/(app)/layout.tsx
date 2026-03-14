import type { ReactNode } from "react";
import { headers } from "next/headers";

import { requireCurrentUser } from "@/features/auth/server/session";
import { AppHeader } from "@/features/navigation/components/app-header";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";

export default async function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireCurrentUser();
  const headerStore = await headers();
  const currentPath = headerStore.get("x-current-path") ?? "/dashboard";

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <AppSidebar currentPath={currentPath} />
        <main className="space-y-6 py-1">
          <AppHeader
            title="Application tracker"
            description="Protected area for managing applications, interview progress, reminders, and resume assets."
            userName={user.name ?? "Developer"}
            userEmail={user.email}
            planLabel={user.plan}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
