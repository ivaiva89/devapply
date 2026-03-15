export function PipelineEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        Pipeline
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        No applications to organize yet.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        Once applications are created, they will appear here in status columns so you can track movement through the funnel.
      </p>
    </div>
  );
}
