import type { ComponentProps } from "react";

import { Button, buttonVariants } from "@/shared/ui/button";
import { FieldShell } from "@/shared/ui/field";
import { compactControlClassName } from "@/shared/ui/form-controls";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  applicationSortSelectOptions,
  applicationStatusFilterOptions,
} from "@/entities/application/model/config";
import type { ApplicationsQueryState } from "@/entities/application/model/types";

type ApplicationsFiltersPresenterProps = {
  action?: ComponentProps<"form">["action"];
  idPrefix?: string;
  resetHref?: string;
  state: ApplicationsQueryState;
};

export function ApplicationsFiltersPresenter({
  action,
  idPrefix = "applications-filters",
  resetHref = "/applications",
  state,
}: ApplicationsFiltersPresenterProps) {
  return (
    <form
      action={action}
      className="rounded-3xl border border-border/70 bg-surface p-5 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_auto] lg:items-end">
        <FieldShell htmlFor={`${idPrefix}-query`} label="Search">
          <Input
            id={`${idPrefix}-query`}
            name="q"
            defaultValue={state.query}
            placeholder="Search by company or role"
          />
        </FieldShell>

        <FieldShell htmlFor={`${idPrefix}-status`} label="Status">
          <Select
            items={applicationStatusFilterOptions}
            name="status"
            defaultValue={state.status}
          >
            <SelectTrigger
              id={`${idPrefix}-status`}
              className={compactControlClassName}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {applicationStatusFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>

        <FieldShell htmlFor={`${idPrefix}-sort`} label="Sort by">
          <Select
            items={applicationSortSelectOptions}
            name="sort"
            defaultValue={state.sort}
          >
            <SelectTrigger
              id={`${idPrefix}-sort`}
              className={compactControlClassName}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {applicationSortSelectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldShell>

        <div className="flex gap-3">
          <Button type="submit">Apply</Button>
          <a
            href={resetHref}
            className={buttonVariants({ variant: "outline" })}
          >
            Reset
          </a>
        </div>
      </div>
    </form>
  );
}
