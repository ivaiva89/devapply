import type { DragEventHandler } from "react";
import { cn } from "@/shared/lib/utils";
import { ApplicationKanbanColumn } from "@/widgets/pipeline-board/ui/application-kanban-column";
import { DesignCard } from "@/components/design/card";
import { Chip, type ChipTone } from "@/components/design/chip";
import {
  applicationStatusLabels,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type {
  PipelineApplicationCard,
  PipelineColumn,
} from "@/features/applications/server/pipeline-board";

const stageTone: Record<ApplicationStatusValue, ChipTone> = {
  WISHLIST:  "slate",
  APPLIED:   "primary",
  INTERVIEW: "accent",
  OFFER:     "success",
  REJECTED:  "danger",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type PipelineBoardPresenterProps = {
  columns: PipelineColumn[];
  errorMessage?: string | null;
  isPending?: boolean;
  dragTargetStatus?: ApplicationStatusValue | null;
  flashCardId?: string | null;
  focusedCardId?: string | null;
  onFocusCard?: (id: string | null) => void;
  onCardDragEnd?: () => void;
  onCardDragStart?: (cardId: string) => void;
  onCardStatusChange?: (cardId: string, nextStatus: ApplicationStatusValue) => void;
  onColumnDragEnter?: (status: ApplicationStatusValue) => void;
  onColumnDragOver?: DragEventHandler<HTMLElement>;
  onColumnDrop?: (status: ApplicationStatusValue) => void;
};

export function PipelineBoardPresenter({
  columns,
  errorMessage = null,
  isPending = false,
  dragTargetStatus = null,
  flashCardId = null,
  focusedCardId = null,
  onFocusCard,
  onCardDragEnd,
  onCardDragStart,
  onCardStatusChange,
  onColumnDragEnter,
  onColumnDragOver,
  onColumnDrop,
}: PipelineBoardPresenterProps) {
  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-card border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-3 xl:grid-cols-5">
        {columns.map((column) => (
          <ApplicationKanbanColumn
            key={column.status}
            label={column.label}
            status={column.status}
            items={column.items.map((item) => ({
              id: item.id,
              company: item.company,
              role: item.role,
              appliedDate: formatDate(item.appliedDate),
              sourceLabel: item.source,
              updatedAt: formatDate(item.updatedAt),
            }))}
            isDragTarget={dragTargetStatus === column.status}
            onDragOver={onColumnDragOver}
            onDragEnter={onColumnDragEnter ? () => onColumnDragEnter(column.status) : undefined}
            onDrop={onColumnDrop ? () => onColumnDrop(column.status) : undefined}
          >
            {column.items.map((item) => (
              <DesignCard
                key={item.id}
                interactive
                tabIndex={0}
                draggable={onCardDragStart ? !isPending : undefined}
                data-card-id={item.id}
                className={cn(
                  "animate-cardIn",
                  flashCardId === item.id && "animate-dropFlash",
                  focusedCardId === item.id && "ring-2 ring-primary ring-offset-2",
                )}
                onFocus={() => onFocusCard?.(item.id)}
                onBlur={() => onFocusCard?.(null)}
                onDragStart={onCardDragStart ? () => onCardDragStart(item.id) : undefined}
                onDragEnd={onCardDragEnd}
              >
                <p className="truncate text-sm font-medium text-text">{item.company}</p>
                <p className="truncate text-sm text-text-2">{item.role}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Chip
                    tone={stageTone[column.status]}
                    label={applicationStatusLabels[column.status]}
                    size="sm"
                  />
                  <span className="font-mono text-[10.5px] text-text-4 tabular-nums">
                    {formatDate(item.appliedDate)}
                  </span>
                </div>
              </DesignCard>
            ))}
          </ApplicationKanbanColumn>
        ))}
      </div>
    </div>
  );
}
