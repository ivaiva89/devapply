import type { DragEventHandler } from "react";
import { cn } from "@/shared/lib/utils";
import { ApplicationKanbanColumn } from "@/widgets/pipeline-board/ui/application-kanban-column";
import { DesignCard } from "@/shared/design/card";
import {
  applicationSourceLabels,
  type ApplicationSourceValue,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type {
  PipelineApplicationCard,
  PipelineColumn,
} from "@/features/applications/server/pipeline-board";

function initials(company: string) {
  return company.slice(0, 2).toUpperCase();
}

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
        {columns.map((column, columnIndex) => {
          const progressPct = Math.round(
            ((columnIndex + 1) / columns.length) * 100,
          );
          return (
            <ApplicationKanbanColumn
              key={column.status}
              label={column.label}
              status={column.status}
              hotkey={String(columnIndex + 1)}
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
                  draggable={!!onCardDragStart && !isPending}
                  data-card-id={item.id}
                  className={cn(
                    "animate-cardIn cursor-grab space-y-1.5",
                    flashCardId === item.id && "animate-dropFlash",
                    focusedCardId === item.id && "ring-2 ring-primary ring-offset-2",
                  )}
                  onFocus={() => onFocusCard?.(item.id)}
                  onBlur={() => onFocusCard?.(null)}
                  onDragStart={onCardDragStart ? () => onCardDragStart(item.id) : undefined}
                  onDragEnd={onCardDragEnd}
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded bg-surface-2 font-mono text-[11px] font-semibold text-text-2">
                      {initials(item.company)}
                    </span>
                    <p className="truncate text-sm font-medium text-text">{item.company}</p>
                  </div>
                  <p className="truncate text-sm text-text-2">{item.role}</p>
                  <div className="flex items-center gap-2 font-mono text-[10.5px] text-text-4 tabular-nums">
                    <span className="truncate">
                      {applicationSourceLabels[item.source as ApplicationSourceValue] ??
                        item.source}
                    </span>
                    <span className="size-[3px] shrink-0 rounded-full bg-text-4" />
                    <span className="shrink-0">{formatDate(item.updatedAt)}</span>
                  </div>
                  <div className="h-0.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </DesignCard>
              ))}
            </ApplicationKanbanColumn>
          );
        })}
      </div>
    </div>
  );
}
