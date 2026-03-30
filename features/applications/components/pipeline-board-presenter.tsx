import type { DragEventHandler } from "react";

import {
  ApplicationCard,
  type ApplicationCardData,
} from "@/features/applications/components/application-card";
import { ApplicationKanbanColumn } from "@/features/applications/components/application-kanban-column";
import type {
  PipelineApplicationCard,
  PipelineColumn,
} from "@/features/applications/server/pipeline-board";
import type { ApplicationStatusValue } from "@/features/applications/config";

type PipelineBoardPresenterProps = {
  columns: PipelineColumn[];
  errorMessage?: string | null;
  isPending?: boolean;
  onCardDragEnd?: () => void;
  onCardDragStart?: (cardId: string) => void;
  onColumnDragOver?: DragEventHandler<HTMLElement>;
  onColumnDrop?: (status: ApplicationStatusValue) => void;
};

function formatDate(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function toApplicationCardData(item: PipelineApplicationCard): ApplicationCardData {
  return {
    id: item.id,
    company: item.company,
    role: item.role,
    appliedDate: formatDate(item.appliedDate),
    sourceLabel: item.source,
    updatedAt: formatDate(item.updatedAt),
  };
}

export function PipelineBoardPresenter({
  columns,
  errorMessage = null,
  isPending = false,
  onCardDragEnd,
  onCardDragStart,
  onColumnDragOver,
  onColumnDrop,
}: PipelineBoardPresenterProps) {
  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((column) => (
          <ApplicationKanbanColumn
            key={column.status}
            label={column.label}
            status={column.status}
            items={column.items.map(toApplicationCardData)}
            onDragOver={onColumnDragOver}
            onDrop={
              onColumnDrop
                ? () => onColumnDrop(column.status)
                : undefined
            }
          >
            {column.items.map((item) => {
              const card = toApplicationCardData(item);

              return (
                <ApplicationCard
                  key={item.id}
                  item={card}
                  draggable={onCardDragStart ? !isPending : undefined}
                  onDragStart={
                    onCardDragStart
                      ? () => onCardDragStart(item.id)
                      : undefined
                  }
                  onDragEnd={onCardDragEnd}
                />
              );
            })}
          </ApplicationKanbanColumn>
        ))}
      </div>
    </div>
  );
}
