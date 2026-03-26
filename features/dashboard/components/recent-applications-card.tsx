import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <Separator />
      <CardContent className="pt-0">
        {items.length > 0 ? (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="-mx-4 flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.company}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{item.role}</p>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className="text-xs tabular-nums text-muted-foreground">
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
