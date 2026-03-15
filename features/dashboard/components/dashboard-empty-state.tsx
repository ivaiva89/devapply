export function DashboardEmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
        Dashboard
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        No dashboard data yet.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        Start by adding applications or reminders. Once activity exists, this dashboard will show pipeline momentum, recent applications, and upcoming follow-ups.
      </p>
    </section>
  );
}
