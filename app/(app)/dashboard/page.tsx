import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PipelineOverviewCard } from "@/features/dashboard/components/pipeline-overview-card";
import { RecentApplicationsCard } from "@/features/dashboard/components/recent-applications-card";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { UpcomingRemindersCard } from "@/features/dashboard/components/upcoming-reminders-card";
import { getDashboardDataForUser } from "@/features/dashboard/server/dashboard-data";
import { requireCurrentUser } from "@/features/auth/server/session";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getDashboardDataForUser(user.id);

  const isEmpty = data.isEmpty;

  return (
    <DashboardShell>
      <DashboardHeader
        title="Dashboard"
        description="Job search overview — pipeline volume, recent activity, and follow-ups."
      />

      <StatsGrid items={data.kpis} />

      {isEmpty ? <DashboardEmptyState /> : null}

      {!isEmpty ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ApplicationsOverTimeChartSection
            items={data.applicationsOverTime}
            isEmpty={isEmpty}
          />
          <PipelineOverviewCard items={data.statuses} isEmpty={isEmpty} />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <RecentApplicationsCard items={data.recentApplications} />
        <UpcomingRemindersCard items={data.reminders} />
      </div>

      <ConversionSummarySection items={data.conversions} isEmpty={isEmpty} />
    </DashboardShell>
  );
}
