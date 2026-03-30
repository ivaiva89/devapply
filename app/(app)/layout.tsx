import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";

import "@/app/globals.css";

import { requireCurrentUser } from "@/features/auth/server/session";
import { AppHeader } from "@/features/navigation/components/app-header";
import { AppSidebar } from "@/features/navigation/components/app-sidebar";

export const metadata: Metadata = {
  title: "DevApply",
  description: "Production-quality foundation for a developer job application tracker SaaS.",
};

export default async function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireCurrentUser();
  const headerStore = await headers();
  const currentPath = headerStore.get("x-current-path") ?? "/dashboard";

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <ClerkProvider>
          <div className="flex min-h-screen">
            {/* Sidebar — fixed width, full height */}
            <div className="hidden w-52 shrink-0 lg:block">
              <div className="fixed inset-y-0 left-0 w-52">
                <AppSidebar currentPath={currentPath} />
              </div>
            </div>
            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="sticky top-0 z-10 bg-background">
                <AppHeader
                  title="Application tracker"
                  description="Protected area for managing applications, interview progress, reminders, and resume assets."
                  userName={user.name ?? "Developer"}
                  userEmail={user.email}
                  planLabel={user.plan}
                />
              </div>
              <main className="flex-1 px-8 py-8">
                <div className="mx-auto max-w-5xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
