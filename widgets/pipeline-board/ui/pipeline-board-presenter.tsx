import type { DragEventHandler } from "react";

import {
  ApplicationCard,
  type ApplicationCardData,
} from "@/entities/application/ui/application-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { compactControlClassName } from "@/shared/ui/form-controls";
import { ApplicationKanbanColumn } from "@/widgets/pipeline-board/ui/application-kanban-column";
import {
  applicationStatusLabels,
  applicationStatusValues,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type {
  PipelineApplicationCard,
  PipelineColumn,
} from "@/features/applications/server/pipeline-board";
import { cn } from "@/shared/lib/utils";

type PipelineBoardPresenterProps = {
  columns: PipelineColumn[];
  errorMessage?: string | null;
  isPending?: boolean;
  onCardDragEnd?: () => void;
  onCardDragStart?: (cardId: string) => void;
  onCardStatusChange?: (
    cardId: string,
    nextStatus: ApplicationStatusValue,
  ) => void;
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

function toApplicationCardData(
  item: PipelineApplicationCard,
): ApplicationCardData {
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
  onCardStatusChange,
  onColumnDragOver,
  onColumnDrop,
}: PipelineBoardPresenterProps) {
  const statusItems = applicationStatusValues.map((statusValue) => ({
    value: statusValue,
    label: applicationStatusLabels[statusValue],
  }));

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
              onColumnDrop ? () => onColumnDrop(column.status) : undefined
            }
          >
            {column.items.map((item) => {
              const card = toApplicationCardData(item);

              return (
                <ApplicationCard
                  key={item.id}
                  item={card}
                  footer={
                    onCardStatusChange ? (
                      <label className="flex flex-col gap-1 xl:hidden">
                        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Move to
                        </span>
                        <Select
                          items={statusItems}
                          defaultValue={column.status}
                          disabled={isPending}
                          onValueChange={(value) =>
                            value
                              ? onCardStatusChange(
                                  item.id,
                                  value as ApplicationStatusValue,
                                )
                              : undefined
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              compactControlClassName,
                              "bg-background",
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {applicationStatusValues.map((statusValue) => (
                              <SelectItem key={statusValue} value={statusValue}>
                                {applicationStatusLabels[statusValue]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                    ) : null
                  }
                  draggable={onCardDragStart ? !isPending : undefined}
                  onDragStart={
                    onCardDragStart ? () => onCardDragStart(item.id) : undefined
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
