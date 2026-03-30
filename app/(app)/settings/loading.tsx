export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded bg-muted/80" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
      </div>
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-8 w-40 animate-pulse rounded bg-muted/80" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-muted/80"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
