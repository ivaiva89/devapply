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
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <SectionHeader
          eyebrow="Dashboard"
          title="Job search overview"
          description="Track current pipeline volume, recent application activity, and follow-ups without leaving the authenticated workspace."
        />
      </section>
      <DashboardStats items={data.kpis} />
      {data.isEmpty ? <DashboardEmptyState /> : null}
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
