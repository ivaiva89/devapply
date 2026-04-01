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
    <header className="bg-background/80 px-4 py-3 backdrop-blur-xl">
      <div className="flex min-h-10 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {title ? (
            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs font-medium text-foreground">{userName}</p>
            <p className="font-label text-[10px] text-muted-foreground">{userEmail}</p>
          </div>
          <Badge
            variant="outline"
            className="h-5 rounded-sm px-1.5 font-label text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            {planLabel}
          </Badge>
          {userControl}
        </div>
      </div>
    </header>
  );
}
