import type { ReactNode } from "react";

import { EmptyState } from "@/shared/design/empty-state";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { cn } from "@/shared/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  align?: "left" | "right";
  className?: string;
  cell: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyTitle: string;
  emptyDescription: string;
  header?: ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyTitle,
  emptyDescription,
  header,
}: DataTableProps<T>) {
  return (
    <Card className="min-w-0 rounded-card border border-border">
      {header ? <CardHeader>{header}</CardHeader> : null}
      <CardContent className={cn("min-w-0 px-0", header ? "pt-0" : undefined)}>
        {rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-surface-1 hover:bg-surface-1">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-text-3",
                      column.align === "right" ? "text-right" : "text-left",
                      column.className,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  className="border-b border-border transition-colors hover:bg-surface-1"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "px-4 py-3 align-top text-sm text-text-2",
                        column.align === "right" ? "text-right" : "text-left",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="px-4 py-8">
            <EmptyState compact title={emptyTitle} description={emptyDescription} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
