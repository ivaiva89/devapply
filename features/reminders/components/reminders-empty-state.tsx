type RemindersEmptyStateProps = {
  canCreate: boolean;
};

export function RemindersEmptyState({
  canCreate,
}: RemindersEmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        Reminders
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        No active reminders.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        {canCreate
          ? "Create your first reminder to keep follow-ups and outreach visible."
          : "Your free-plan reminder limit has been reached. Upgrade to Pro to keep more active reminders."}
      </p>
    </section>
  );
}
