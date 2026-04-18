import { cn } from "@/shared/lib/utils";
import { DesignCard } from "@/shared/design/card";

type KpiItem = {
  label: string;
  value: number | string;
  valueSuffix?: string;
  helper?: string;
  delta?: string;
  valueColor?: "accent" | "success";
};

type StatsGridProps = {
  items: KpiItem[];
};

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item) => (
        <DesignCard
          key={item.label}
          className="flex flex-col gap-0.5 p-4 transition-all hover:border-border-strong"
        >
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs text-text-3">{item.label}</p>
            {item.delta ? (
              <span className="font-mono text-[11px] text-success">
                {item.delta}
              </span>
            ) : null}
          </div>
          <p
            className={cn(
              "text-3xl font-semibold tabular-nums leading-none tracking-tight",
              item.valueColor === "accent" && "text-accent",
              item.valueColor === "success" && "text-success",
              !item.valueColor && "text-text",
            )}
          >
            {item.value}
            {item.valueSuffix ? (
              <span className="ml-0.5 text-base font-semibold text-text-3">
                {item.valueSuffix}
              </span>
            ) : null}
          </p>
          {item.helper ? (
            <p className="mt-0.5 font-mono text-xs text-text-4">
              {item.helper}
            </p>
          ) : null}
        </DesignCard>
      ))}
    </div>
  );
}
