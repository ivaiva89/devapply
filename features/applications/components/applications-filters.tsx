import { applicationSortSelectOptions, applicationStatusOptions } from "@/features/applications/server/application-list";
import type { ApplicationsQueryState } from "@/features/applications/types";

type ApplicationsFiltersProps = {
  state: ApplicationsQueryState;
};

export function ApplicationsFilters({ state }: ApplicationsFiltersProps) {
  return (
    <form className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] lg:items-end">
        <div className="space-y-2">
          <label htmlFor="q" className="text-sm font-medium text-stone-700">
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={state.query}
            placeholder="Search by company or role"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-stone-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={state.status}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {applicationStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="sort" className="text-sm font-medium text-stone-700">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={state.sort}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {applicationSortSelectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Apply
          </button>
          <a
            href="/applications"
            className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
          >
            Reset
          </a>
        </div>
      </div>
    </form>
  );
}
