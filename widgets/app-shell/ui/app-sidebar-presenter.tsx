import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { Badge } from "@/shared/ui/badge";
import { appNavigation } from "@/widgets/app-shell/model/navigation-items";

type AppSidebarPresenterProps = {
  currentPath: string;
};

function isItemActive(currentPath: string, href: string) {
  if (href === "/dashboard") {
    return currentPath === href;
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppSidebarPresenter({ currentPath }: AppSidebarPresenterProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="gap-3 p-3">
        <Link
          href="/dashboard"
          className="flex min-h-12 items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/30 px-3 py-2 transition-colors hover:bg-sidebar-accent"
        >
          <Image
            src="/devapply-logo-optimized.svg"
            alt="DevApply"
            width={150}
            height={150}
            className="h-9 w-auto shrink-0"
          />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-sidebar-foreground">
              DevApply
            </p>
            <p className="text-xs leading-5 text-sidebar-foreground/70">
              Developer job search workspace
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-1">
        <SidebarMenu>
          {appNavigation.map((item) => {
            const isActive = isItemActive(currentPath, item.href);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className="h-10 rounded-lg px-2.5"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/20 px-3 py-3 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-sidebar-foreground">
                Stay organized
              </p>
              <p className="text-xs leading-5 text-sidebar-foreground/70">
                Manage applications, reminders, and resumes from one place.
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-sidebar-border bg-sidebar text-sidebar-foreground"
            >
              MVP
            </Badge>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
