import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/design/empty-state";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

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
      <CardHeader>
        <CardTitle>Recent applications</CardTitle>
        <CardDescription className="text-xs">Latest tracked roles.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.company}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{item.role}</p>
                </div>
                <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                  <ApplicationStatusBadge status={item.status} />
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(item.updatedAt)}
                  </span>
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
