import { PageHeader } from "@/components/design/page-header";
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
      <PageHeader
        title="Reminders"
        description="Track outreach, status checks, and next steps."
        breadcrumb="reminders"
        actions={
          <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-3">
            {data.activeReminderCount}{" "}
            {data.activeReminderCount === 1
              ? "active reminder"
              : "active reminders"}
          </div>
        }
      />
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
