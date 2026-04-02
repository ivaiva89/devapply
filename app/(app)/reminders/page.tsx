import { requireCurrentUser } from "@/features/auth/server/session";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { CreateReminderForm } from "@/features/reminders/components/create-reminder-form";
import { RemindersEmptyState } from "@/widgets/reminders-panel/ui/reminders-empty-state";
import { RemindersList } from "@/widgets/reminders-panel/ui/reminders-list";
import { getRemindersPageDataForUser } from "@/features/reminders/server/reminder-list";

export default async function RemindersPage() {
  const user = await requireCurrentUser();
  const data = await getRemindersPageDataForUser(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Reminders
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Follow-up reminders
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Track outreach, status checks, and next steps without leaving the
              authenticated workspace.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {data.activeReminderCount}{" "}
            {data.activeReminderCount === 1
              ? "active reminder"
              : "active reminders"}
          </div>
        </div>
      </section>
      {!data.canCreate ? (
        <>
          <UpgradePrompt
            title="Upgrade to keep more active reminders."
            description={`Free plan users can keep ${FREE_PLAN_LIMITS.reminders} active reminders. Upgrade to Pro to create more follow-ups and outreach tracking tasks.`}
          />
          <UpgradeButton />
        </>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <CreateReminderForm
          applicationOptions={data.applicationOptions}
          canCreate={data.canCreate}
        />
        <div className="space-y-4">
          {data.reminders.length > 0 ? (
            <RemindersList
              applicationOptions={data.applicationOptions}
              reminders={data.reminders}
            />
          ) : (
            <RemindersEmptyState canCreate={data.canCreate} />
          )}
        </div>
      </div>
    </div>
  );
}
