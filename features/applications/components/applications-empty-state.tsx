type ApplicationsEmptyStateProps = {
  hasFilters: boolean;
};

export function ApplicationsEmptyState({
  hasFilters,
}: ApplicationsEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        Applications
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        {hasFilters ? "No applications match these filters." : "No applications yet."}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        {hasFilters
          ? "Try a broader search, switch the status filter, or reset sorting and filters to see the full list."
          : "Once applications are created, they will appear here with search, status filtering, and sort controls."}
      </p>
    </div>
  );
}
