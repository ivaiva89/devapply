export default function ApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="h-10 w-72 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-stone-100" />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-12 w-40 animate-pulse rounded-2xl bg-stone-100" />
          <div className="h-12 w-40 animate-pulse rounded-full bg-stone-100" />
        </div>
      </div>
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] lg:items-end">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
              <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-2xl bg-stone-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
