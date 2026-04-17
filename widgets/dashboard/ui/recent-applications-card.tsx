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
      <CardHeader className="pb-3 sm:pb-4">
        <p className="font-display text-lg font-semibold tracking-tight text-text">
          Recent Applications
        </p>
        <p className="text-sm text-text-3">Latest tracked roles.</p>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="group -mx-2 flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-1/40 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {item.company}
                  </p>
                  <p className="truncate text-xs text-text-3">
                    {item.role}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-left sm:ml-4 sm:shrink-0 sm:justify-end sm:gap-3 sm:text-right">
                  <span className="font-label text-xs tabular-nums text-text-3">
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
