import type { ReactNode } from "react";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/design/data-table";
import { SectionHeader } from "@/components/design/section-header";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/features/applications/config";

export type ApplicationTableRow = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatusValue;
  appliedDate: string;
  sourceLabel: string;
  source: ApplicationSourceValue;
  updatedAt: string;
  actions?: ReactNode;
};

type ApplicationsTableProps = {
  applications: ApplicationTableRow[];
  title?: string;
  description?: string;
};

const columns: DataTableColumn<ApplicationTableRow>[] = [
  {
    key: "company",
    header: "Company",
    cell: (row) => (
      <div>
        <p className="font-medium text-foreground">{row.company}</p>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    cell: (row) => row.role,
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <ApplicationStatusBadge status={row.status} />,
  },
  {
    key: "appliedDate",
    header: "Applied date",
    cell: (row) => row.appliedDate,
  },
  {
    key: "source",
    header: "Source",
    cell: (row) => row.sourceLabel,
  },
  {
    key: "updatedAt",
    header: "Updated",
    cell: (row) => row.updatedAt,
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    cell: (row) => row.actions ?? null,
  },
];

export function ApplicationsTable({
  applications,
  title = "Tracked applications",
  description = "Review current applications, statuses, and source channels from a single table.",
}: ApplicationsTableProps) {
  return (
    <DataTable
      columns={columns}
      rows={applications}
      getRowKey={(row) => row.id}
      emptyTitle="No applications yet"
      emptyDescription="Once applications are created, they will appear here with current status and source details."
      header={<SectionHeader title={title} description={description} />}
    />
  );
}
