import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/design/section-header";
import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { ApplicationCard } from "@/features/applications/components/application-card";
import { ApplicationKanbanColumn } from "@/features/applications/components/application-kanban-column";
import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { PipelineEmptyState } from "@/features/applications/components/pipeline-empty-state";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ApplicationsStatusChartSection } from "@/features/dashboard/components/applications-status-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentApplicationsSection } from "@/features/dashboard/components/recent-applications-section";
import { UpcomingRemindersSection } from "@/features/dashboard/components/upcoming-reminders-section";
import { RemindersEmptyState } from "@/features/reminders/components/reminders-empty-state";
import { ResumesEmptyState } from "@/features/resumes/components/resumes-empty-state";
import {
  mockApplicationsOverTime,
  mockApplicationsStatusDistribution,
  mockApplicationTableRows,
  mockDashboardConversions,
  mockDashboardKpis,
  mockPipelineColumns,
  mockRecentApplications,
  mockReminderListItems,
  mockResumeListItems,
  mockUpcomingReminders,
} from "@/lib/mocks/ui-fixtures";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-6">
        <section className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-sm">
          <SectionHeader
            eyebrow="Preview workspace"
            title="UI-only product showcase"
            description="This route mirrors Storybook fixtures inside the app shell so dashboard, applications, pipeline, reminders, resumes, and billing states can be reviewed without auth, database, or server actions."
            actions={<Button size="sm">Use for visual QA</Button>}
          />
        </section>

        <Tabs defaultValue="dashboard" className="gap-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="organize">Reminders and resumes</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats items={mockDashboardKpis} />
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <ApplicationsStatusChartSection
                items={mockApplicationsStatusDistribution}
                isEmpty={false}
              />
              <ApplicationsOverTimeChartSection
                items={mockApplicationsOverTime}
                isEmpty={false}
              />
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <RecentApplicationsSection items={mockRecentApplications} />
              <UpcomingRemindersSection items={mockUpcomingReminders} />
            </div>
            <ConversionSummarySection
              items={mockDashboardConversions}
              isEmpty={false}
            />
            <DashboardEmptyState />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTable
              title="Applications table"
              description="Search, status, source, and activity coverage with realistic placeholder data."
              applications={mockApplicationTableRows.map((row) => ({
                ...row,
                actions: (
                  <div className="flex justify-end gap-2">
                    <Button size="xs" variant="outline">
                      Edit
                    </Button>
                    <Button size="xs" variant="ghost">
                      Delete
                    </Button>
                  </div>
                ),
              }))}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ApplicationsEmptyState hasFilters={false} />
              <ApplicationsEmptyState hasFilters />
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
              <SectionHeader
                eyebrow="Pipeline"
                title="Kanban composition preview"
                description="The interactive production board is server-wired, but the visual pipeline building blocks stay previewable here with static data."
              />
              <div className="mt-6 grid gap-4 xl:grid-cols-5">
                {mockPipelineColumns.map((column) => (
                  <ApplicationKanbanColumn
                    key={column.status}
                    label={column.label}
                    status={column.status}
                    items={column.items}
                  >
                    {column.items.map((item) => (
                      <ApplicationCard key={item.id} item={item} />
                    ))}
                  </ApplicationKanbanColumn>
                ))}
              </div>
            </section>
            <PipelineEmptyState />
          </TabsContent>

          <TabsContent value="organize" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Reminders"
                  title="Follow-up list mock"
                  description="Preview route stays UI-only, so reminder rows are rendered as static examples instead of live mutation forms."
                />
                <div className="mt-6 space-y-4">
                  {mockReminderListItems.map((item) => (
                    <Card key={item.id} className="rounded-3xl border border-border/70 bg-background shadow-none">
                      <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <p className="text-lg font-semibold tracking-tight text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Remind at {formatDate(item.remindAt)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.application
                              ? `${item.application.company} - ${item.application.role}`
                              : "General reminder"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Mark done
                          </Button>
                          <Button size="sm">Mark sent</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Resumes"
                  title="Resume library mock"
                  description="Resume upload and attachment flows stay server-bound in production, but file cards can still be reviewed here with placeholder metadata."
                />
                <div className="mt-6 space-y-4">
                  {mockResumeListItems.map((resume) => (
                    <Card key={resume.id} className="rounded-3xl border border-border/70 bg-background shadow-none">
                      <CardHeader>
                        <CardTitle>{resume.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>{resume.fileName}</p>
                          <p>
                            {formatBytes(resume.fileSizeBytes)} · {resume.mimeType} · Uploaded{" "}
                            {formatDate(resume.uploadedAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {resume.attachedApplications.length > 0 ? (
                            resume.attachedApplications.map((application) => (
                              <span
                                key={application.id}
                                className="rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground"
                              >
                                {application.company} - {application.role}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No linked applications yet.
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Open file
                          </Button>
                          <Button size="sm">Attach resume</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <RemindersEmptyState canCreate />
              <ResumesEmptyState canUpload />
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <UpgradePrompt
              title="Upgrade to keep tracking more applications."
              description="Free plan users can track 30 applications, keep 1 resume, and hold 3 active reminders. Upgrade states stay previewable here without touching hosted checkout."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Free plan summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">30</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-sm text-muted-foreground">Resumes</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">1</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-muted/40 p-4">
                      <p className="text-sm text-muted-foreground">Reminders</p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">3</p>
                    </div>
                  </div>
                  <Button>Upgrade to Pro</Button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Pro plan summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Pro removes the MVP usage caps and routes ongoing subscription
                    management into Polar&apos;s hosted customer portal.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline">Manage billing</Button>
                    <Button variant="ghost">Portal unavailable state</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
