import type { DragEventHandler, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Chip } from "@/shared/design/chip";
import {
  applicationStatusChipTones,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";
import type { ApplicationCardData } from "@/entities/application/ui/application-card";

type ApplicationKanbanColumnProps = {
  label: string;
  status: ApplicationStatusValue;
  items: ApplicationCardData[];
  children: ReactNode;
  hotkey?: string;
  isDragTarget?: boolean;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDragEnter?: DragEventHandler<HTMLElement>;
  onDrop?: DragEventHandler<HTMLElement>;
};

export function ApplicationKanbanColumn({
  label,
  status,
  items,
  children,
  hotkey,
  isDragTarget = false,
  onDragOver,
  onDragEnter,
  onDrop,
}: ApplicationKanbanColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      className={cn(
        "flex min-h-96 flex-col rounded-card transition-colors duration-[200ms]",
        isDragTarget
          ? "border-2 border-dashed border-primary bg-primary-soft"
          : "border border-border bg-surface-1",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <Chip tone={applicationStatusChipTones[status]} label={label} />
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10.5px] text-text-4">{items.length}</span>
          {hotkey ? (
            <kbd className="inline-flex h-5 items-center rounded px-1 font-mono text-[10px] text-text-4 ring-1 ring-border">
              {hotkey}
            </kbd>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-2 pb-2">
        {children}
      </div>
    </div>
  );
}
