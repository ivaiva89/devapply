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
    <Card className="group relative rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-card/80 shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader className="relative space-y-2 pb-3 pt-6">
        <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardDescription>
        <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          {value}
        </CardTitle>
      </CardHeader>
      {helper ? (
        <CardContent className="relative pt-0 text-sm text-muted-foreground">
          {helper}
        </CardContent>
      ) : null}
    </Card>
  );
}
