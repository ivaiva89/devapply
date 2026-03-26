import type { ReactNode } from "react";

type StatsCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
};

export function StatsCard({ label, value, helper }: StatsCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80 hover:bg-muted/30">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {helper ? (
        <p className="text-xs text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}
