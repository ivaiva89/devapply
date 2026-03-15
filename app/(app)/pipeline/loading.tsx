export default function PipelineLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-stone-100" />
        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-stone-100" />
      </div>
      <div className="grid gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
          >
            <div className="h-8 w-24 animate-pulse rounded-full bg-stone-100" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((__, cardIndex) => (
                <div
                  key={cardIndex}
                  className="h-28 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
