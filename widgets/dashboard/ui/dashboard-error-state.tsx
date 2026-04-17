import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type DashboardErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function DashboardErrorState({
  title = "The dashboard could not be loaded.",
  description = "An unexpected error occurred while loading the dashboard.",
  action,
}: DashboardErrorStateProps) {
  return (
    <Card className="border-destructive/30 bg-card">
      <CardHeader className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-destructive">
          Dashboard error
        </p>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="max-w-2xl text-sm text-text-3">{description}</p>
        {action ? <div>{action}</div> : null}
      </CardContent>
    </Card>
  );
}
