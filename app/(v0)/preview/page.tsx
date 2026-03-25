import type { ApplicationStatusValue } from "@/features/applications/config";
import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { SectionHeader } from "@/components/design/section-header";

const mockData = {
  kpis: [
    { label: "Total applications", value: 42, helper: "All tracked applications" },
    {
      label: "Applications this month",
      value: 11,
      helper: "Created since the first of the month",
    },
    { label: "Interviews", value: 6, helper: "Interview status" },
    { label: "Offers", value: 1, helper: "Offer status" },
  ],
  applicationsOverTime: [
    { label: "Oct", count: 3 },
    { label: "Nov", count: 5 },
    { label: "Dec", count: 7 },
    { label: "Jan", count: 9 },
    { label: "Feb", count: 11 },
    { label: "Mar", count: 7 },
  ],
  recentApplications: [
    {
      id: "1",
      company: "Stripe",
      role: "Frontend Engineer",
      status: "INTERVIEW" as ApplicationStatusValue,
      updatedAt: "2026-03-10T12:00:00.000Z",
    },
    {
      id: "2",
      company: "Linear",
      role: "Software Engineer",
      status: "APPLIED" as ApplicationStatusValue,
      updatedAt: "2026-03-09T12:00:00.000Z",
    },
    {
      id: "3",
      company: "Vercel",
      role: "Fullstack Engineer",
      status: "WISHLIST" as ApplicationStatusValue,
      updatedAt: "2026-03-08T12:00:00.000Z",
    },
    {
      id: "4",
      company: "Ramp",
      role: "Product Engineer",
      status: "OFFER" as ApplicationStatusValue,
      updatedAt: "2026-03-07T12:00:00.000Z",
    },
  ],
  reminders: [
    {
      id: "r1",
      title: "Follow up with recruiter",
      dueAt: "2026-03-18T10:00:00.000Z",
      company: "Stripe",
    },
    {
      id: "r2",
      title: "Send thank-you note",
      dueAt: "2026-03-19T14:00:00.000Z",
      company: "Linear",
    },
    {
      id: "r3",
      title: "Check application status",
      dueAt: "2026-03-21T09:00:00.000Z",
      company: null,
    },
  ],
  conversions: [
    {
      label: "Response rate",
      value: "31%",
      helper: "Interview, offer, or rejected",
    },
    {
      label: "Interview conversion",
      value: "17%",
      helper: "Current statuses at interview or beyond",
    },
    {
      label: "Offer conversion",
      value: "2%",
      helper: "Current offers out of total applications",
    },
    {
      label: "Active pipeline",
      value: "86%",
      helper: "Wishlist, applied, and interview statuses",
    },
  ],
  isEmpty: false,
};

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-6">
        <main className="space-y-6 py-1">
          <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
            <SectionHeader
              eyebrow="Dashboard"
              title="Job search overview"
              description="Track current pipeline volume, recent application activity, and follow-ups without leaving the authenticated workspace."
            />
          </section>
          <DashboardStats items={mockData.kpis} />
          {mockData.isEmpty ? <DashboardEmptyState /> : null}
          <ApplicationsOverTimeChartSection
            items={mockData.applicationsOverTime}
            isEmpty={mockData.kpis[0]?.value === 0}
          />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <RecentApplicationsSection items={mockData.recentApplications} />
            <UpcomingRemindersSection items={mockData.reminders} />
          </div>
          <ConversionSummarySection
            items={mockData.conversions}
            isEmpty={mockData.kpis[0]?.value === 0}
          />
        </main>
      </div>
    </div>
  );
}
