import { PLAN_LABELS, FREE_PLAN_LIMITS } from "@/features/billing/config";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";

type PlanSummaryProps = {
  plan: "FREE" | "PRO";
  userId: string;
};

export function PlanSummary({ plan, userId }: PlanSummaryProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
        Billing
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
        {PLAN_LABELS[plan]} plan
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        {plan === "PRO"
          ? "Your account currently has Pro access and should not be blocked by feature limits."
          : "Your account is currently on the Free plan with server-enforced usage limits."}
      </p>
      {plan === "FREE" ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Applications</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                {FREE_PLAN_LIMITS.applications}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Resumes</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                {FREE_PLAN_LIMITS.resumes}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm text-stone-500">Active reminders</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">
                {FREE_PLAN_LIMITS.reminders}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <UpgradeButton userId={userId} />
          </div>
        </>
      ) : null}
    </section>
  );
}
