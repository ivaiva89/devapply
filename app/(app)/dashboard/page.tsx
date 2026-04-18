import { ApplicationsOverTimeChartSection } from "@/widgets/dashboard/ui/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/widgets/dashboard/ui/conversion-summary-section";
import { DashboardEmptyState } from "@/widgets/dashboard/ui/dashboard-empty-state";
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
  const now = new Date();

  const todayEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  const todayItems = data.reminders
    .filter((r) => new Date(r.dueAt) <= todayEnd)
    .map((r) => {
      const dueDate = new Date(r.dueAt);
      const isOverdue = dueDate < now;
      const titleLower = r.title.toLowerCase();

      let chipLabel: string;
      let chipTone: "accent" | "warning" | "primary";

      if (isOverdue) {
        chipLabel = "Follow-up";
        chipTone = "warning";
      } else if (titleLower.includes("interview")) {
        chipLabel = "Interview";
        chipTone = "accent";
      } else {
        chipLabel = "Due today";
        chipTone = "primary";
      }

      let timeLabel: string;
      if (isOverdue) {
        const daysOverdue = Math.floor(
          (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        timeLabel = daysOverdue > 0 ? `Overdue ${daysOverdue}d` : "Overdue";
      } else {
        const isToday =
          dueDate.getUTCFullYear() === now.getUTCFullYear() &&
          dueDate.getUTCMonth() === now.getUTCMonth() &&
          dueDate.getUTCDate() === now.getUTCDate();
        if (isToday) {
          timeLabel = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }).format(dueDate);
        } else {
          timeLabel = `by ${new Intl.DateTimeFormat("en-US", {
            weekday: "short",
          }).format(dueDate)}`;
        }
      }

      return {
        id: r.id,
        text: r.company ? `${r.title} · ${r.company}` : r.title,
        chipLabel,
        chipTone,
        timeLabel,
      };
    });

  return (
    <DashboardShell userName={user.name ?? undefined} todayItems={todayItems}>
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
