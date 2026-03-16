import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border border-dashed border-border bg-card text-center shadow-sm">
      <CardHeader className={compact ? "py-6" : "py-10"}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle className="mt-3 text-2xl font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "pb-6 pt-0" : "pb-10 pt-0"}>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
