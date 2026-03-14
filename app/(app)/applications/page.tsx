import { ApplicationsEmptyState } from "@/features/applications/components/applications-empty-state";
import { ApplicationsFilters } from "@/features/applications/components/applications-filters";
import { ApplicationsTable } from "@/features/applications/components/applications-table";
import { NewApplicationModal } from "@/features/applications/components/new-application-modal";
import { getApplicationsForUser } from "@/features/applications/server/application-list";
import { requireCurrentUser } from "@/features/auth/server/session";

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
  const { items, state } = await getApplicationsForUser(
    user.id,
    resolvedSearchParams,
  );
  const hasFilters = Boolean(state.query) || state.status !== "ALL";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Applications
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
              Applications table
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-stone-600">
              Search, filter, and sort the authenticated user&apos;s applications without exposing any cross-user data.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
              {items.length} {items.length === 1 ? "application" : "applications"}
            </div>
            <NewApplicationModal />
          </div>
        </div>
      </section>
      <ApplicationsFilters state={state} />
      {items.length > 0 ? (
        <ApplicationsTable applications={items} />
      ) : (
        <ApplicationsEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
}
