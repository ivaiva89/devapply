export default function PipelineLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-surface p-8 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-surface-1" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-surface-1/80" />
        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-surface-1/70" />
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-border/70 bg-surface p-4 shadow-sm"
          >
            <div className="h-8 w-24 animate-pulse rounded-full bg-surface-1/80" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((__, cardIndex) => (
                <div
                  key={cardIndex}
                  className="h-28 animate-pulse rounded-2xl bg-surface-1/80"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
