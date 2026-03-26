import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ApplicationsStatusChartSection } from "@/features/dashboard/components/applications-status-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { getDashboardDataForUser } from "@/features/dashboard/server/dashboard-data";
import { requireCurrentUser } from "@/features/auth/server/session";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getDashboardDataForUser(user.id);

  const isEmpty = data.isEmpty;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-base font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Job search overview — pipeline volume, recent activity, and follow-ups.
        </p>
      </div>

      {/* KPI row */}
      <DashboardStats items={data.kpis} />

      {/* Empty state */}
      {isEmpty ? <DashboardEmptyState /> : null}

      {/* Charts row */}
      {!isEmpty ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ApplicationsOverTimeChartSection
            items={data.applicationsOverTime}
            isEmpty={isEmpty}
          />
          <ApplicationsStatusChartSection
            items={data.statuses}
            isEmpty={isEmpty}
          />
        </div>
      ) : null}

      {/* Activity row */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <RecentApplicationsSection items={data.recentApplications} />
        <UpcomingRemindersSection items={data.reminders} />
      </div>

      {/* Funnel */}
      <ConversionSummarySection
        items={data.conversions}
        isEmpty={isEmpty}
      />
    </div>
  );
}
