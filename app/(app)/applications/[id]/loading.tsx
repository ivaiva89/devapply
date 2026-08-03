export default function ApplicationDetailLoading() {
  return (
    <div className="min-w-0 space-y-5">
      <div className="h-3 w-40 animate-pulse rounded bg-surface-1" />
      <div className="flex items-start gap-3.5">
        <div className="size-11 animate-pulse rounded-card bg-surface-1" />
        <div className="space-y-2">
          <div className="h-6 w-72 animate-pulse rounded bg-surface-1" />
          <div className="h-4 w-48 animate-pulse rounded bg-surface-1/80" />
          <div className="h-5 w-56 animate-pulse rounded-chip bg-surface-1/70" />
        </div>
      </div>
      <div className="h-14 animate-pulse rounded-card border border-border bg-surface-1" />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="h-80 animate-pulse rounded-card border border-border bg-surface" />
        <div className="space-y-3">
          <div className="h-52 animate-pulse rounded-card border border-border bg-surface" />
          <div className="h-28 animate-pulse rounded-card border border-border bg-surface" />
          <div className="h-24 animate-pulse rounded-card border border-border bg-surface" />
        </div>
      </div>
    </div>
  );
}
