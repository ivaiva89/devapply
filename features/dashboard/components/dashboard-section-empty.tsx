import { EmptyState } from "@/components/design/empty-state";

type DashboardSectionEmptyProps = {
  title: string;
  description: string;
};

export function DashboardSectionEmpty({
  title,
  description,
}: DashboardSectionEmptyProps) {
  return (
    <EmptyState compact title={title} description={description} />
  );
}
