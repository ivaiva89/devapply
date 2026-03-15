import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { DashboardSectionEmpty } from "@/features/dashboard/components/dashboard-section-empty";

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
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Recent applications
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
            Latest activity
          </h2>
        </div>
      </div>
      <div className="mt-6">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-950">
                    {item.company}
                  </p>
                  <p className="text-sm text-stone-600">{item.role}</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <ApplicationStatusBadge status={item.status} />
                  <p className="text-xs text-stone-500">
                    Updated {formatDate(item.updatedAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <DashboardSectionEmpty
            title="No recent applications"
            description="Applications will appear here once you start tracking roles."
          />
        )}
      </div>
    </section>
  );
}
