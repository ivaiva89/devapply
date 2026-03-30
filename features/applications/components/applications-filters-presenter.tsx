import type { ComponentProps } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applicationStatusFilterOptions } from "@/features/applications/config";
import { applicationSortSelectOptions } from "@/features/applications/server/application-list";
import type { ApplicationsQueryState } from "@/features/applications/types";

type ApplicationsFiltersPresenterProps = {
  action?: ComponentProps<"form">["action"];
  idPrefix?: string;
  resetHref?: string;
  state: ApplicationsQueryState;
};

const selectInputClasses =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";

export function ApplicationsFiltersPresenter({
  action,
  idPrefix = "applications-filters",
  resetHref = "/applications",
  state,
}: ApplicationsFiltersPresenterProps) {
  return (
    <form
      action={action}
      className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] lg:items-end">
        <div className="space-y-2">
          <label
            htmlFor={`${idPrefix}-query`}
            className="text-sm font-medium text-foreground"
          >
            Search
          </label>
          <Input
            id={`${idPrefix}-query`}
            name="q"
            defaultValue={state.query}
            placeholder="Search by company or role"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${idPrefix}-status`}
            className="text-sm font-medium text-foreground"
          >
            Status
          </label>
          <select
            id={`${idPrefix}-status`}
            name="status"
            defaultValue={state.status}
            className={selectInputClasses}
          >
            {applicationStatusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${idPrefix}-sort`}
            className="text-sm font-medium text-foreground"
          >
            Sort by
          </label>
          <select
            id={`${idPrefix}-sort`}
            name="sort"
            defaultValue={state.sort}
            className={selectInputClasses}
          >
            {applicationSortSelectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Apply</Button>
          <a href={resetHref} className={buttonVariants({ variant: "outline" })}>
            Reset
          </a>
        </div>
      </div>
    </form>
  );
}
