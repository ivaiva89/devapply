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
    <header className="flex h-10 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {title ? (
          <span className="font-medium text-foreground">{title}</span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{userName}</span>
        <Badge
          variant="outline"
          className="h-5 rounded-sm px-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"
        >
          {planLabel}
        </Badge>
        {userControl}
      </div>
    </header>
  );
}
