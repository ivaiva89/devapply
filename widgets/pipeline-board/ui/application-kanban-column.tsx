import type { DragEventHandler, ReactNode } from "react";

import type { ApplicationCardData } from "@/entities/application/ui/application-card";
import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";
import type { ApplicationStatusValue } from "@/entities/application/model/config";
import { EmptyState } from "@/shared/design/empty-state";
import { SectionHeader } from "@/shared/design/section-header";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

type ApplicationKanbanColumnProps = {
  label: string;
  status: ApplicationStatusValue;
  items: ApplicationCardData[];
  children: ReactNode;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDrop?: DragEventHandler<HTMLElement>;
};

export function ApplicationKanbanColumn({
  label,
  status,
  items,
  children,
  onDragOver,
  onDrop,
}: ApplicationKanbanColumnProps) {
  return (
    <Card
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="min-h-[24rem] rounded-3xl bg-card transition-colors hover:bg-card/80"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-3">
          <ApplicationStatusBadge status={status} />
          <Badge variant="secondary" className="rounded-full px-2.5 py-1">
            {items.length}
          </Badge>
        </div>
        <SectionHeader title={label} className="pt-3" />
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          children
        ) : (
          <EmptyState
            compact
            title="No applications in this column yet."
            description="Move cards here as the pipeline changes."
          />
        )}
      </CardContent>
    </Card>
  );
}
