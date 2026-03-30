"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/design/section-header";
import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { ApplicationDeleteDialogPresenter } from "@/features/applications/components/application-delete-dialog-presenter";
import { ApplicationFormModalPresenter } from "@/features/applications/components/application-form-modal-presenter";
import { ApplicationRowActionsMenu } from "@/features/applications/components/application-row-actions-menu";
import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { ApplicationsFiltersPresenter } from "@/features/applications/components/applications-filters-presenter";
import { PipelineEmptyState } from "@/features/applications/components/pipeline-empty-state";
import { PipelineBoardPresenter } from "@/features/applications/components/pipeline-board-presenter";
import { NewApplicationTrigger } from "@/features/applications/components/new-application-trigger";
import {
  createApplicationDefaultValues,
  getCreateApplicationInitialState,
} from "@/features/applications/create-application-form";
import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";
import { PlanSummaryPresenter } from "@/features/billing/components/plan-summary-presenter";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { CreateReminderFormPresenter } from "@/features/reminders/components/create-reminder-form-presenter";
import { ReminderDeleteDialogPresenter } from "@/features/reminders/components/reminder-delete-dialog-presenter";
import { ApplicationsOverTimeChartSection } from "@/features/dashboard/components/applications-over-time-chart-section";
import { ConversionSummarySection } from "@/features/dashboard/components/conversion-summary-section";
import { DashboardEmptyState } from "@/features/dashboard/components/dashboard-empty-state";
import { DashboardErrorState } from "@/features/dashboard/components/dashboard-error-state";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardLoadingState } from "@/features/dashboard/components/dashboard-loading-state";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import { PipelineOverviewCard } from "@/features/dashboard/components/pipeline-overview-card";
import { RecentApplicationsCard } from "@/features/dashboard/components/recent-applications-card";
import { StatsGrid } from "@/features/dashboard/components/stats-grid";
import { UpcomingRemindersCard } from "@/features/dashboard/components/upcoming-reminders-card";
import { RemindersEmptyState } from "@/features/reminders/components/reminders-empty-state";
import { RemindersListPresenter } from "@/features/reminders/components/reminders-list-presenter";
import { AppHeaderPresenter } from "@/features/navigation/components/app-header-presenter";
import { AppSidebarPresenter } from "@/features/navigation/components/app-sidebar-presenter";
import { AttachResumeFormPresenter } from "@/features/resumes/components/attach-resume-form-presenter";
import { ResumeListPresenter } from "@/features/resumes/components/resume-list-presenter";
import { ResumesEmptyState } from "@/features/resumes/components/resumes-empty-state";
import { UploadResumeFormPresenter } from "@/features/resumes/components/upload-resume-form-presenter";
import {
  mockApplicationsOverTime,
  mockApplicationsStatusDistribution,
  mockApplicationTableRows,
  mockDashboardConversions,
  mockDashboardKpis,
  mockNavigationShellUser,
  mockPipelineBoardColumns,
  mockReminderApplicationOptions,
  mockRecentApplications,
  mockReminderListItems,
  mockResumeApplicationOptions,
  mockResumeListItems,
  mockUpcomingReminders,
} from "@/lib/mocks/ui-fixtures";

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
            <TabsTrigger value="shell">App shell</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="organize">Reminders and resumes</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="shell" className="space-y-6">
            <section className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm">
              <SectionHeader
                eyebrow="Navigation shell"
                title="App chrome preview"
                description="Sidebar and header presenters mirror the authenticated app shell without Clerk or route-header dependencies."
              />
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background">
                <div className="grid min-h-[28rem] lg:grid-cols-[13rem_minmax(0,1fr)]">
                  <div className="border-b border-border/70 lg:border-b-0 lg:border-r">
                    <AppSidebarPresenter currentPath="/applications" />
                  </div>
                  <div className="min-w-0">
                    <AppHeaderPresenter
                      title="Application tracker"
                      description="Protected area for managing applications, interview progress, reminders, and resume assets."
                      userName={mockNavigationShellUser.name}
                      userEmail={mockNavigationShellUser.email}
                      planLabel={mockNavigationShellUser.planLabel}
                      userControl={
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                          AJ
                        </div>
                      }
                    />
                    <div className="p-8">
                      <DashboardShell>
                        <DashboardHeader
                          title="Dashboard"
                          description="Job search overview — pipeline volume, recent activity, and follow-ups."
                        />
                        <StatsGrid items={mockDashboardKpis} />
                      </DashboardShell>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <section className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-sm">
              <DashboardShell>
                <DashboardHeader
                  title="Dashboard"
                  description="Job search overview — pipeline volume, recent activity, and follow-ups."
                />
                <StatsGrid items={mockDashboardKpis} />
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                  <ApplicationsOverTimeChartSection
                    items={mockApplicationsOverTime}
                    isEmpty={false}
                  />
                  <PipelineOverviewCard
                    items={mockApplicationsStatusDistribution}
                    isEmpty={false}
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <RecentApplicationsCard items={mockRecentApplications} />
                  <UpcomingRemindersCard items={mockUpcomingReminders} />
                </div>
                <ConversionSummarySection
                  items={mockDashboardConversions}
                  isEmpty={false}
                />
              </DashboardShell>
            </section>

            <div className="grid gap-6 xl:grid-cols-3">
              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Dashboard state"
                  title="Empty"
                  description="Route-level empty state using the same dashboard presenter."
                />
                <div className="mt-6">
                  <DashboardEmptyState />
                </div>
              </section>

              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Dashboard state"
                  title="Loading"
                  description="Skeleton state matches the shipped dashboard surface."
                />
                <div className="mt-6">
                  <DashboardLoadingState />
                </div>
              </section>

              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Dashboard state"
                  title="Error"
                  description="Error card uses the same near-black and indigo system."
                />
                <div className="mt-6">
                  <DashboardErrorState
                    description="Previewing the dashboard error state without a retry handler."
                  />
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsFiltersPresenter
              state={{
                query: "engineer",
                status: "INTERVIEW",
                sort: "updated-desc",
              }}
              resetHref="#reset"
            />
            <div className="flex justify-end">
              <NewApplicationTrigger />
            </div>
            <ApplicationsTable
              title="Applications table"
              description="Search, status, source, and activity coverage with realistic placeholder data."
              applications={mockApplicationTableRows.map((row) => ({
                ...row,
                actions: <ApplicationRowActionsMenu />,
              }))}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ApplicationsEmptyState hasFilters={false} />
              <ApplicationsEmptyState hasFilters />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <ApplicationFormModalPresenter
                description="Preview the shared application form modal presenter with mock validation state."
                isOpen
                state={getCreateApplicationInitialState(createApplicationDefaultValues)}
                submitLabel="Create application"
                submittingLabel="Saving..."
                title="New application"
              />
              <ApplicationDeleteDialogPresenter
                company="Vercel"
                isOpen
              />
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
              <SectionHeader
                eyebrow="Pipeline"
                title="Kanban composition preview"
                description="The same presenter used by the production pipeline wrapper stays previewable here with static data."
              />
              <div className="mt-6">
                <PipelineBoardPresenter columns={mockPipelineBoardColumns} />
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
                  description="Reminder form and list presenters stay previewable without touching server actions."
                />
                <div className="mt-6 space-y-6">
                  <CreateReminderFormPresenter
                    applicationOptions={mockReminderApplicationOptions}
                    canCreate
                  />
                  <RemindersListPresenter
                    reminders={mockReminderListItems}
                    renderActions={() => (
                      <>
                        <Button size="sm" variant="outline">
                          Mark done
                        </Button>
                        <Button size="sm">Mark sent</Button>
                        <Button size="sm" variant="ghost">
                          Delete
                        </Button>
                      </>
                    )}
                  />
                  <ReminderDeleteDialogPresenter
                    isOpen
                    title="Follow up after interview"
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                <SectionHeader
                  eyebrow="Resumes"
                  title="Resume library mock"
                  description="Upload, attach, and list presenters now mirror the production resume surface with static fixtures."
                />
                <div className="mt-6 space-y-6">
                  <UploadResumeFormPresenter canUpload />
                  <ResumeListPresenter
                    resumes={mockResumeListItems}
                    renderAttachForm={(resume) => (
                      <AttachResumeFormPresenter
                        applicationOptions={mockResumeApplicationOptions}
                        resumeId={resume.id}
                      />
                    )}
                  />
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
              <PlanSummaryPresenter
                plan="FREE"
                actions={
                  <>
                    <BillingActionButtonPresenter
                      label="Upgrade to Pro"
                      pendingLabel="Redirecting..."
                    />
                    <BillingActionButtonPresenter
                      label="Manage existing billing"
                      pendingLabel="Opening..."
                      variant="outline"
                    />
                  </>
                }
              />

              <PlanSummaryPresenter
                plan="PRO"
                actions={
                  <BillingActionButtonPresenter
                    label="Manage billing"
                    pendingLabel="Opening..."
                    variant="outline"
                  />
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
