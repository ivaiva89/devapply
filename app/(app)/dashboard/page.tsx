import { ApplicationsOverTimeChartSection } from "@/widgets/dashboard/ui/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/widgets/dashboard/ui/conversion-summary-section";
import { DashboardEmptyState } from "@/widgets/dashboard/ui/dashboard-empty-state";
import { DashboardHeader } from "@/widgets/dashboard/ui/dashboard-header";
import { DashboardShell } from "@/widgets/dashboard/ui/dashboard-shell";
import { PipelineOverviewCard } from "@/widgets/dashboard/ui/pipeline-overview-card";
import { RecentApplicationsCard } from "@/widgets/dashboard/ui/recent-applications-card";
import { StatsGrid } from "@/widgets/dashboard/ui/stats-grid";
import { UpcomingRemindersCard } from "@/widgets/dashboard/ui/upcoming-reminders-card";
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
