import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { getDashboardDataForUser } from "@/features/dashboard/server/dashboard-data";
import { requireCurrentUser } from "@/features/auth/server/session";
import { SectionHeader } from "@/components/design/section-header";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getDashboardDataForUser(user.id);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-card/80 p-8 shadow-lg">
        <SectionHeader
          eyebrow="Dashboard"
          title="Job search overview"
          description="Track current pipeline volume, recent application activity, and follow-ups without leaving the authenticated workspace."
        />
      </section>
      <div>
        <DashboardStats items={data.kpis} />
      </div>
      {data.isEmpty ? <DashboardEmptyState /> : null}
      <ApplicationsOverTimeChartSection
        items={data.applicationsOverTime}
        isEmpty={data.kpis[0]?.value === 0}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <RecentApplicationsSection items={data.recentApplications} />
        <UpcomingRemindersSection items={data.reminders} />
      </div>
      <ConversionSummarySection
        items={data.conversions}
        isEmpty={data.kpis[0]?.value === 0}
      />
    </div>
  );
}
