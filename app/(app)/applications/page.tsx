import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { ApplicationsFilters } from "@/features/applications/components/applications-filters";
import { ApplicationsTableClient } from "@/widgets/applications-table/ui/applications-table-client";
import { NewApplicationButton } from "@/features/applications/components/new-application-button";
import { getApplicationsForUser } from "@/features/applications/server/application-list";
import { requireCurrentUser } from "@/features/auth/server/session";
import { prisma } from "@/shared/lib/prisma";
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
  const [{ items, state, totalCount }, statusGroups] = await Promise.all([
    getApplicationsForUser(user.id, resolvedSearchParams),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { status: true },
    }),
  ]);
  const statusCounts: Record<string, number> = {};
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count.status;
  }
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
            <div className="min-w-0 rounded-card border border-border bg-surface px-4 py-2 text-sm text-text-3">
              {resultsLabel}
            </div>
            <NewApplicationButton />
          </>
        }
      />
      <ApplicationsFilters state={state} />
      {items.length > 0 ? (
        <ApplicationsTableClient
          applications={items}
          statusCounts={statusCounts}
        />
      ) : (
        <ApplicationsEmptyState hasFilters={hasFilters || hasActiveSort} />
      )}
    </div>
  );
}
