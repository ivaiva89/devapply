type PlaceholderPanelProps = {
  title: string;
  description: string;
};

export function PlaceholderPanel({
  title,
  description,
}: PlaceholderPanelProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5">
      <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
    </div>
  );
}
