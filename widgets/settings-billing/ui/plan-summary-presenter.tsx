import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { FREE_PLAN_LIMITS, PLAN_LABELS } from "@/features/billing/config";

type PlanSummaryPresenterProps = {
  plan: "FREE" | "PRO" | "LIFETIME";
  actions?: ReactNode;
};

export function PlanSummaryPresenter({
  plan,
  actions,
}: PlanSummaryPresenterProps) {
  return (
    <Card className="rounded-3xl border-none bg-card shadow-sm">
      <CardHeader className="space-y-2">
        <p className="font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-text-3">
          Billing
        </p>
        <CardTitle className="font-display text-2xl font-bold tracking-tight text-text">
          {PLAN_LABELS[plan]} plan
        </CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-text-3">
          {plan === "PRO"
            ? "Your account currently has Pro access and should not be blocked by feature limits. Billing updates and cancellations can be managed through Polar's hosted customer portal."
            : plan === "LIFETIME"
              ? "Your account has lifetime access with no subscription required. All limits are removed permanently."
              : "Your account is currently on the Free plan with server-enforced usage limits and a hosted checkout upgrade path."}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {plan === "FREE" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-1/30 p-5">
              <p className="font-label text-xs uppercase tracking-wide text-text-3">
                Applications
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-text">
                {FREE_PLAN_LIMITS.applications}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-1/30 p-5">
              <p className="font-label text-xs uppercase tracking-wide text-text-3">
                Resumes
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-text">
                {FREE_PLAN_LIMITS.resumes}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-1/30 p-5">
              <p className="font-label text-xs uppercase tracking-wide text-text-3">
                Active reminders
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-text">
                {FREE_PLAN_LIMITS.reminders}
              </p>
            </div>
          </div>
        ) : null}

        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {actions}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
