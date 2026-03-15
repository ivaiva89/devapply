type DashboardKpiGridProps = {
  items: Array<{
    label: string;
    value: number;
    helper: string;
  }>;
};

export function DashboardKpiGrid({ items }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <section
          key={item.label}
          className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <p className="text-sm text-stone-500">{item.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-stone-600">{item.helper}</p>
        </section>
      ))}
    </div>
  );
}
