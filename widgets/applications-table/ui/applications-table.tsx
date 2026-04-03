import type { ReactNode } from "react";

import { DataTable, type DataTableColumn } from "@/shared/design/data-table";
import { SectionHeader } from "@/shared/design/section-header";
import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";
import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/entities/application/model/config";

export type ApplicationTableRow = {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatusValue;
  appliedDate: string;
  sourceLabel: string;
  source: ApplicationSourceValue;
  lastActivity: string;
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
    key: "location",
    header: "Location",
    cell: (row) => row.location,
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
    key: "lastActivity",
    header: "Last activity",
    cell: (row) => row.lastActivity,
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
