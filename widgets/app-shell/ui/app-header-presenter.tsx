import type { ReactNode } from "react";

import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { SidebarTrigger } from "@/shared/ui/sidebar";

type AppHeaderPresenterProps = {
  description?: string;
  planLabel: string;
  title?: string;
  userControl?: ReactNode;
  userEmail: string;
  userName: string;
};

export function AppHeaderPresenter({
  description,
  planLabel,
  title,
  userControl = null,
  userEmail,
  userName,
}: AppHeaderPresenterProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-border/70 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-3 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg border border-border/70" />
        <Separator
          orientation="vertical"
          className="hidden data-[orientation=vertical]:h-5 sm:block"
        />
        <div className="min-w-0 flex-1">
          {title ? (
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">
              {title}
            </p>
          ) : null}
          {description ? (
            <p className="hidden truncate text-xs text-muted-foreground md:block">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="h-6 rounded-md px-2 font-label text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            {planLabel}
          </Badge>
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-foreground">{userName}</p>
            <p className="font-label text-[10px] text-muted-foreground">
              {userEmail}
            </p>
          </div>
          {userControl}
        </div>
      </div>
    </header>
  );
}
