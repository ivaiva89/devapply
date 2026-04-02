import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";
import { EmptyState } from "@/shared/design/empty-state";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

type RecentApplicationsCardProps = {
  items: Array<{
    id: string;
    company: string;
    role: string;
    status: Parameters<typeof ApplicationStatusBadge>[0]["status"];
    updatedAt: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function RecentApplicationsCard({ items }: RecentApplicationsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="font-display text-lg font-semibold tracking-tight text-foreground">
          Recent Applications
        </p>
        <p className="text-sm text-muted-foreground">Latest tracked roles.</p>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.company}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.role}
                  </p>
                </div>
                <div className="ml-4 flex shrink-0 items-center justify-end gap-3 text-right">
                  <span className="font-label text-xs tabular-nums text-muted-foreground">
                    {formatDate(item.updatedAt)}
                  </span>
                  <ApplicationStatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            title="No recent applications"
            description="Applications will appear here once you start tracking roles."
          />
        )}
      </CardContent>
    </Card>
  );
}
