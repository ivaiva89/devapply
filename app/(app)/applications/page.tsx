import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { ApplicationsFilters } from "@/features/applications/components/applications-filters";
import { ApplicationsTableClient } from "@/widgets/applications-table/ui/applications-table-client";
import { NewApplicationModal } from "@/features/applications/components/new-application-modal";
import { getApplicationsForUser } from "@/features/applications/server/application-list";
import { requireCurrentUser } from "@/features/auth/server/session";
import { PageHeader } from "@/shared/design/page-header";

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
  const { items, state, totalCount } = await getApplicationsForUser(
    user.id,
    resolvedSearchParams,
  );
  const hasFilters = Boolean(state.query) || state.status !== "ALL";
  const hasActiveSort = state.sort !== "updated-desc";
  const resultsLabel =
    hasFilters || hasActiveSort
      ? `${items.length} of ${totalCount} ${totalCount === 1 ? "application" : "applications"}`
      : `${totalCount} ${totalCount === 1 ? "application" : "applications"}`;

  return (
    <div className="min-w-0 space-y-6">
      <PageHeader
        title="Applications"
        description="Search, filter, and sort your job applications."
        breadcrumb="applications"
        actions={
          <>
            <div className="min-w-0 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-3">
              {resultsLabel}
            </div>
            <NewApplicationModal />
          </>
        }
      />
      <ApplicationsFilters state={state} />
      {items.length > 0 ? (
        <ApplicationsTableClient applications={items} />
      ) : (
        <ApplicationsEmptyState hasFilters={hasFilters || hasActiveSort} />
      )}
    </div>
  );
}
