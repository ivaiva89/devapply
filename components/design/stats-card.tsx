import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: ReactNode;
  helper?: string;
  icon?: LucideIcon;
};

export function StatsCard({ label, value, helper, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          {Icon ? <Icon className="size-3.5 shrink-0 text-muted-foreground/40" /> : null}
        </div>
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {value}
        </p>
        {helper ? (
          <p className="text-xs text-muted-foreground">{helper}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
