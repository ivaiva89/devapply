import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

import "@/app/globals.css";

import { requireCurrentUser } from "@/features/auth/server/session";
import { AppHeader } from "@/widgets/app-shell/ui/app-header";
import { AppSidebar } from "@/widgets/app-shell/ui/app-sidebar";

export const metadata: Metadata = {
  title: "DevApply",
  description:
    "Production-quality foundation for a developer job application tracker SaaS.",
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
      className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <ClerkProvider>
          <div className="min-h-screen bg-muted/40">
            <AppHeader
              currentPath={currentPath}
              title="DevApply"
              description="Track applications, reminders, resumes, and billing in one workspace."
              userName={user.name ?? "Developer"}
              userEmail={user.email}
              planLabel={user.plan}
            />
            <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-8">
              <aside className="hidden lg:block">
                <div className="sticky top-24 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background shadow-sm">
                  <AppSidebar currentPath={currentPath} />
                </div>
              </aside>
              <div className="grid min-w-0 gap-6">{children}</div>
            </main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
