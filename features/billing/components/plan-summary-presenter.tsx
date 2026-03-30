import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FREE_PLAN_LIMITS, PLAN_LABELS } from "@/features/billing/config";

type PlanSummaryPresenterProps = {
  plan: "FREE" | "PRO";
  actions?: ReactNode;
};

export function PlanSummaryPresenter({
  plan,
  actions,
}: PlanSummaryPresenterProps) {
  return (
    <Card className="rounded-3xl border border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Billing
        </p>
        <CardTitle className="text-2xl tracking-tight">
          {PLAN_LABELS[plan]} plan
        </CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {plan === "PRO"
            ? "Your account currently has Pro access and should not be blocked by feature limits. Billing updates and cancellations can be managed through Polar's hosted customer portal."
            : "Your account is currently on the Free plan with server-enforced usage limits and a hosted checkout upgrade path."}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {plan === "FREE" ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Applications</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {FREE_PLAN_LIMITS.applications}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Resumes</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {FREE_PLAN_LIMITS.resumes}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Active reminders</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {FREE_PLAN_LIMITS.reminders}
              </p>
            </div>
          </div>
        ) : null}

        {actions ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">{actions}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
