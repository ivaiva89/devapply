import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

import "@/app/globals.css";

import { PostHogIdentify } from "@/features/analytics/components/posthog-identify";
import { requireCurrentUser } from "@/features/auth/server/session";
import { AppSidebarPresenter } from "@/widgets/app-shell/ui/app-sidebar-presenter";

export const metadata: Metadata = {
  title: "DevApply",
  description: "Developer job application tracker.",
};

export default async function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [user, headerStore] = await Promise.all([
    requireCurrentUser(),
    headers(),
  ]);
  const currentPath = headerStore.get("x-current-path") ?? "/dashboard";

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-canvas text-text antialiased">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem
        >
          <ClerkProvider>
            <div className="flex min-h-screen">
              <aside className="hidden w-60 shrink-0 lg:flex">
                <div className="sticky top-0 flex h-screen w-full flex-col border-r border-border bg-surface-1">
                  <AppSidebarPresenter currentPath={currentPath} />
                </div>
              </aside>
              <main className="min-w-0 flex-1 px-8 py-6">
                {children}
              </main>
            </div>
            <PostHogIdentify
              userId={user.id}
              email={user.email}
              name={user.name}
              plan={user.plan}
            />
            <Analytics />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
