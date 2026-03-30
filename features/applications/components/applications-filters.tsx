import { ApplicationsFiltersPresenter } from "@/features/applications/components/applications-filters-presenter";
import type { ApplicationsQueryState } from "@/features/applications/types";

type ApplicationsFiltersProps = {
  state: ApplicationsQueryState;
};

export function ApplicationsFilters({ state }: ApplicationsFiltersProps) {
  return <ApplicationsFiltersPresenter state={state} />;
}
