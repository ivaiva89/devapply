import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

type StatsCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  valueClassName?: string;
};

export function StatsCard({
  label,
  value,
  helper,
  icon: Icon,
  highlight = false,
  valueClassName,
}: StatsCardProps) {
  return (
    <Card className={cn(highlight && "border-primary/20 bg-primary/5")}>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm font-medium",
              highlight ? "text-primary/90" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          {Icon ? (
            <Icon
              className={cn(
                "size-3.5 shrink-0",
                highlight ? "text-primary/40" : "text-muted-foreground/40",
              )}
            />
          ) : null}
        </div>
        <p
          className={cn(
            "font-display text-4xl font-semibold tabular-nums tracking-tight",
            valueClassName ?? "text-foreground",
          )}
        >
          {value}
        </p>
        {helper ? (
          <p className="font-label text-xs tracking-wide text-muted-foreground">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
