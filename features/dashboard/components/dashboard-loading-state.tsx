import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardLoadingState() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-3 w-80 max-w-full animate-pulse rounded bg-muted/70" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm">
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="size-3.5 animate-pulse rounded bg-muted/70" />
              </div>
              <div className="h-8 w-16 animate-pulse rounded bg-muted/80" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted/70" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
              <div className="h-3 w-56 max-w-full animate-pulse rounded bg-muted/70" />
            </CardHeader>
            <CardContent>
              <div className="h-32 animate-pulse rounded-lg bg-muted/60" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3 w-28 animate-pulse rounded bg-muted/70" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="h-12 animate-pulse rounded-lg bg-muted/60"
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
