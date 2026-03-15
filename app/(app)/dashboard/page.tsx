import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardKpiGrid } from "@/features/dashboard/components/dashboard-kpi-grid";
import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { getDashboardDataForUser } from "@/features/dashboard/server/dashboard-data";
import { requireCurrentUser } from "@/features/auth/server/session";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const data = await getDashboardDataForUser(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Dashboard
        </p>
        <div className="mt-3 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
            Job search overview
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">
            Track current pipeline volume, recent application activity, and follow-ups without leaving the authenticated workspace.
          </p>
        </div>
      </section>
      <DashboardKpiGrid items={data.kpis} />
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
