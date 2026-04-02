import type { CSSProperties, ReactNode } from "react";
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

import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
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
          <SidebarProvider
            defaultOpen
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as CSSProperties
            }
          >
            <AppSidebar currentPath={currentPath} />
            <SidebarInset>
              <AppHeader
                title="DevApply"
                description="Track applications, reminders, resumes, and billing in one workspace."
                userName={user.name ?? "Developer"}
                userEmail={user.email}
                planLabel={user.plan}
              />
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
                    {children}
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
