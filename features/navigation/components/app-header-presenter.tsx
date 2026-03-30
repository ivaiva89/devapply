import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

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
    <header className="border-b border-border px-4 py-3">
      <div className="flex min-h-10 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {title ? (
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {title}
            </p>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-medium text-foreground">{userName}</p>
            <p className="text-[11px] text-muted-foreground">{userEmail}</p>
          </div>
          <Badge
            variant="outline"
            className="h-5 rounded-sm px-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            {planLabel}
          </Badge>
          {userControl}
        </div>
      </div>
    </header>
  );
}
