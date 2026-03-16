import { EmptyState } from "@/components/design/empty-state";
import { SectionHeader } from "@/components/design/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

type RecentApplicationsSectionProps = {
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
    year: "numeric",
  }).format(new Date(value));
}

export function RecentApplicationsSection({
  items,
}: RecentApplicationsSectionProps) {
  return (
    <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <SectionHeader eyebrow="Recent applications" title="Latest activity" />
      <div className="mt-6">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border border-border bg-muted/40 shadow-none"
              >
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.company}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <ApplicationStatusBadge status={item.status} />
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(item.updatedAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            title="No recent applications"
            description="Applications will appear here once you start tracking roles."
          />
        )}
      </div>
    </section>
  );
}
