import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { ApplicationsFilters } from "@/features/applications/components/applications-filters";
import { ApplicationsTableClient } from "@/widgets/applications-table/ui/applications-table-client";
import { NewApplicationModal } from "@/features/applications/components/new-application-modal";
import { getApplicationsForUser } from "@/features/applications/server/application-list";
import { requireCurrentUser } from "@/features/auth/server/session";
import { UpgradeButton } from "@/features/billing/components/upgrade-button";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { FREE_PLAN_LIMITS } from "@/features/billing/config";
import { getPlanGateFromUsage } from "@/features/billing/server/plan-enforcement";
import { SectionHeader } from "@/shared/design/section-header";

type ApplicationsPageProps = {
  searchParams?: Promise<{
    q?: string | string[] | undefined;
    status?: string | string[] | undefined;
    sort?: string | string[] | undefined;
  }>;
};

export default async function ApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireCurrentUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const { items, state, totalCount, plan } = await getApplicationsForUser(
    user.id,
    resolvedSearchParams,
  );
  const hasFilters = Boolean(state.query) || state.status !== "ALL";
  const hasActiveSort = state.sort !== "updated-desc";
  const canCreateApplication = getPlanGateFromUsage(
    plan,
    totalCount,
    "applications",
  ).allowed;
  const resultsLabel =
    hasFilters || hasActiveSort
      ? `${items.length} of ${totalCount} ${totalCount === 1 ? "application" : "applications"}`
      : `${totalCount} ${totalCount === 1 ? "application" : "applications"}`;

  return (
    <div className="min-w-0 space-y-6">
      <section className="min-w-0 rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Applications"
            title="Applications table"
            description="Search, filter, and sort the authenticated user's applications without exposing any cross-user data."
          />
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {resultsLabel}
            </div>
            <NewApplicationModal disabled={!canCreateApplication} />
          </div>
        </div>
      </section>
      {!canCreateApplication ? (
        <>
          <UpgradePrompt
            title="Upgrade to keep tracking more applications."
            description={`Free plan users can track ${FREE_PLAN_LIMITS.applications} applications. Upgrade to Pro to remove the application limit and keep a larger search pipeline active.`}
          />
          <UpgradeButton />
        </>
      ) : null}
      <ApplicationsFilters state={state} />
      {items.length > 0 ? (
        <ApplicationsTableClient applications={items} />
      ) : (
        <ApplicationsEmptyState hasFilters={hasFilters || hasActiveSort} />
      )}
    </div>
  );
}
