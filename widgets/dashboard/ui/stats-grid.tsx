import { DesignCard } from "@/components/design/card";

type KpiItem = {
  label: string;
  value: number | string;
  helper?: string;
};

type StatsGridProps = {
  items: KpiItem[];
};

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {items.map((item) => (
        <DesignCard key={item.label} className="flex flex-col gap-1 p-4">
          <p className="text-xs text-text-3">{item.label}</p>
          <p className="text-2xl font-semibold tabular-nums text-text">{item.value}</p>
          {item.helper ? (
            <p className="text-xs text-text-4">{item.helper}</p>
          ) : null}
        </DesignCard>
      ))}
    </div>
  );
}
