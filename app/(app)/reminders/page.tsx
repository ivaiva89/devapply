import { PageHeader } from "@/shared/design/page-header";
import { requireCurrentUser } from "@/features/auth/server/session";
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
          <span className="rounded-card border border-border bg-surface px-3 py-1.5 font-mono text-[11.5px] tabular-nums text-text-3">
            {data.activeReminderCount} active
          </span>
        }
      />
      <CreateReminderForm applicationOptions={data.applicationOptions} />
      {data.reminders.length > 0 ? (
        <RemindersList
          applicationOptions={data.applicationOptions}
          reminders={data.reminders}
        />
      ) : (
        <RemindersEmptyState />
      )}
    </div>
  );
}
