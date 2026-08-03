import type { ReactNode } from "react";
import Link from "next/link";

import { DataTable, type DataTableColumn } from "@/shared/design/data-table";
import { SectionHeader } from "@/shared/design/section-header";
import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";
import {
  applicationStatusChipTones,
  applicationStatusLabels,
  applicationStatusValues,
  type ApplicationSourceValue,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type { ChipTone } from "@/shared/design/chip";
import { cn } from "@/shared/lib/utils";

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

const chipToneStyles: Record<
  ChipTone,
  { active: string; inactive: string }
> = {
  slate:   { active: "bg-surface-2 text-text-3",       inactive: "text-text-3 hover:bg-surface-2/60" },
  primary: { active: "bg-primary-soft text-primary",   inactive: "text-text-3 hover:bg-primary-soft/60" },
  info:    { active: "bg-info-soft text-info",         inactive: "text-text-3 hover:bg-info-soft/60" },
  accent:  { active: "bg-accent-soft text-accent",     inactive: "text-text-3 hover:bg-accent-soft/60" },
  success: { active: "bg-success-soft text-success",   inactive: "text-text-3 hover:bg-success-soft/60" },
  danger:  { active: "bg-danger-soft text-danger",     inactive: "text-text-3 hover:bg-danger-soft/60" },
};

type ApplicationsTableProps = {
  applications: ApplicationTableRow[];
  title?: string;
  description?: string;
  activeStatus?: ApplicationStatusValue | null;
  statusCounts?: Record<string, number>;
  onStatusFilter?: (status: ApplicationStatusValue | null) => void;
};

function companyInitials(company: string) {
  return company.slice(0, 2).toUpperCase();
}

const columns: DataTableColumn<ApplicationTableRow>[] = [
  {
    key: "company",
    header: "Company",
    cell: (row) => (
      <Link
        href={`/applications/${row.id}`}
        className="-mx-1 flex items-center gap-2.5 rounded px-1 py-0.5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="grid size-[22px] shrink-0 place-items-center rounded bg-surface-2 font-mono text-[11px] font-semibold text-text-2">
          {companyInitials(row.company)}
        </span>
        <span className="font-medium text-text">{row.company}</span>
      </Link>
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

const chipBaseClassName =
  "inline-flex items-center rounded-chip px-2.5 py-1 font-mono text-[11.5px] font-medium transition-colors cursor-pointer";

export function ApplicationsTable({
  applications,
  title = "Tracked applications",
  description = "Review current applications, statuses, and source channels from a single table.",
  activeStatus = null,
  statusCounts,
  onStatusFilter,
}: ApplicationsTableProps) {
  const totalCount = statusCounts
    ? Object.values(statusCounts).reduce((sum, count) => sum + count, 0)
    : undefined;

  const filterChips = onStatusFilter ? (
    <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3 pt-1">
      <button
        type="button"
        aria-pressed={activeStatus === null}
        onClick={() => onStatusFilter(null)}
        className={cn(
          chipBaseClassName,
          activeStatus === null
            ? "bg-primary-soft text-primary"
            : "text-text-3 hover:bg-primary-soft/60",
        )}
      >
        All
        {totalCount !== undefined ? (
          <span className="ml-1.5 tabular-nums opacity-70">{totalCount}</span>
        ) : null}
      </button>
      {applicationStatusValues.map((status) => {
        const tone = applicationStatusChipTones[status];
        const styles = chipToneStyles[tone];
        const isActive = activeStatus === status;
        const count = statusCounts?.[status];
        return (
          <button
            key={status}
            type="button"
            aria-pressed={isActive}
            onClick={() => onStatusFilter(isActive ? null : status)}
            className={cn(
              chipBaseClassName,
              isActive ? styles.active : styles.inactive,
            )}
          >
            {applicationStatusLabels[status]}
            {count !== undefined ? (
              <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
            ) : null}
          </button>
        );
      })}
      {activeStatus !== null ? (
        <button
          type="button"
          onClick={() => onStatusFilter(null)}
          className="ml-1 font-mono text-[11px] text-text-3 underline-offset-2 hover:text-text hover:underline"
        >
          clear
        </button>
      ) : null}
    </div>
  ) : null;

  return (
    <DataTable
      columns={columns}
      rows={applications}
      getRowKey={(row) => row.id}
      emptyTitle="No applications yet"
      emptyDescription="Once applications are created, they will appear here with current status and source details."
      header={
        <>
          <SectionHeader title={title} description={description} />
          {filterChips}
        </>
      }
    />
  );
}
