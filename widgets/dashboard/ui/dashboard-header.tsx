import { PageHeader } from "@/components/design/page-header";

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={description}
      breadcrumb="dashboard"
    />
  );
}
