import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
};

export function StatsCard({ label, value, helper }: StatsCardProps) {
  return (
    <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-4xl font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardHeader>
      {helper ? (
        <CardContent className="pt-0 text-sm text-muted-foreground">
          {helper}
        </CardContent>
      ) : null}
    </Card>
  );
}
