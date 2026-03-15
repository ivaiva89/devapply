export default function ResumesLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-stone-100" />
        <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-stone-100" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
            <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
            <div className="h-12 animate-pulse rounded-2xl bg-stone-100" />
            <div className="h-10 w-36 animate-pulse rounded-full bg-stone-100" />
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <div className="h-6 w-40 animate-pulse rounded bg-stone-100" />
              <div className="mt-4 h-28 animate-pulse rounded-2xl bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
