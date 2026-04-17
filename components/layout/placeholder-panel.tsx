type PlaceholderPanelProps = {
  title: string;
  description: string;
};

export function PlaceholderPanel({
  title,
  description,
}: PlaceholderPanelProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-1/30 p-5">
      <h2 className="text-sm font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-3">
        {description}
      </p>
    </div>
  );
}
