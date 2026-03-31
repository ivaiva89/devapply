import type { ReactNode } from "react";

import { EmptyState } from "@/components/design/empty-state";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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
    <Card className="rounded-3xl border-none bg-card shadow-sm">
      {header ? <CardHeader>{header}</CardHeader> : null}
      <CardContent className={header ? "pt-0" : undefined}>
        {rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-border/15 bg-muted/20 hover:bg-muted/20">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "px-5 py-4 font-label text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground",
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
                <TableRow key={getRowKey(row)} className="border-border/15 transition-colors hover:bg-muted/30">
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "px-5 py-4 align-top text-sm text-muted-foreground",
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
          <EmptyState
            compact
            title={emptyTitle}
            description={emptyDescription}
          />
        )}
      </CardContent>
    </Card>
  );
}
