import { StatsCard } from "@/components/design/stats-card";

type DashboardStatsProps = {
  items: Array<{
    label: string;
    value: number;
    helper: string;
  }>;
};

export function DashboardStats({ items }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatsCard
          key={item.label}
          label={item.label}
          value={item.value}
          helper={item.helper}
        />
      ))}
    </div>
  );
}
