type DashboardSectionEmptyProps = {
  title: string;
  description: string;
};

export function DashboardSectionEmpty({
  title,
  description,
}: DashboardSectionEmptyProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm leading-6 text-stone-600">
      <p className="font-medium text-stone-900">{title}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}
