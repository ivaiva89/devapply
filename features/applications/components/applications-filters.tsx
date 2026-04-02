import { ApplicationsFiltersPresenter } from "@/features/applications/components/applications-filters-presenter";
import type { ApplicationsQueryState } from "@/entities/application/model/types";

type ApplicationsFiltersProps = {
  state: ApplicationsQueryState;
};

export function ApplicationsFilters({ state }: ApplicationsFiltersProps) {
  return <ApplicationsFiltersPresenter state={state} />;
}
