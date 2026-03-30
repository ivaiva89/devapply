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
    <header className="border-b border-border px-6 py-4">
      <div className="flex min-h-12 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {title ? (
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {title}
            </p>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          <div className="text-right">
            <p className="text-sm font-medium leading-none text-foreground">
              {userName}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            {planLabel}
          </Badge>
          {userControl}
        </div>
      </div>
    </header>
  );
}
