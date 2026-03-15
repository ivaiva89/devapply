export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-28 animate-pulse rounded bg-stone-200" />
            <div className="mt-4 h-10 w-20 animate-pulse rounded bg-stone-100" />
            <div className="mt-3 h-4 w-36 animate-pulse rounded bg-stone-100" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="h-20 animate-pulse rounded-2xl bg-stone-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
