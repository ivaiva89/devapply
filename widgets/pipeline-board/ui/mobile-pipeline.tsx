"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Chip, type ChipTone } from "@/components/design/chip";
import { DesignCard } from "@/components/design/card";
import { updateApplicationStatus } from "@/features/applications/server/update-application-status";
import type { PipelineColumn, PipelineApplicationCard } from "@/features/applications/server/pipeline-board";
import {
  applicationStatusLabels,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";

const stageTone: Record<ApplicationStatusValue, ChipTone> = {
  WISHLIST:  "slate",
  APPLIED:   "primary",
  INTERVIEW: "accent",
  OFFER:     "success",
  REJECTED:  "danger",
};

const NON_REJECTED_STATUSES: ApplicationStatusValue[] = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
];

function moveCard(
  columns: PipelineColumn[],
  cardId: string,
  nextStatus: ApplicationStatusValue,
): PipelineColumn[] {
  let movedCard: PipelineApplicationCard | null = null;

  const withoutCard = columns.map((column) => {
    const remainingItems = column.items.filter((item) => {
      const shouldKeep = item.id !== cardId;
      if (!shouldKeep) movedCard = item;
      return shouldKeep;
    });
    return { ...column, items: remainingItems };
  });

  if (!movedCard) return columns;

  const cardToMove: PipelineApplicationCard = movedCard;

  return withoutCard.map((column) =>
    column.status === nextStatus
      ? {
          ...column,
          items: [{ ...cardToMove, updatedAt: new Date().toISOString() }, ...column.items],
        }
      : column,
  );
}

type MobilePipelineProps = {
  initialColumns: PipelineColumn[];
};

export function MobilePipeline({ initialColumns }: MobilePipelineProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeStatus, setActiveStatus] = useState<ApplicationStatusValue>("WISHLIST");
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleStatusChange(cardId: string, nextStatus: ApplicationStatusValue) {
    const sourceColumn = columns.find((col) => col.items.some((item) => item.id === cardId));
    if (!sourceColumn || sourceColumn.status === nextStatus) return;

    const previousColumns = columns;
    const nextColumns = moveCard(columns, cardId, nextStatus);

    setErrorMessage(null);
    setColumns(nextColumns);

    startTransition(async () => {
      const result = await updateApplicationStatus(cardId, nextStatus);
      if (result.status === "error") {
        setColumns(previousColumns);
        setErrorMessage(result.message);
      }
    });
  }

  const activeColumn = columns.find((col) => col.status === activeStatus);
  const visibleCards = activeColumn?.items ?? [];

  return (
    <div className="flex flex-col">
      {/* Stage tab bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {NON_REJECTED_STATUSES.map((status) => {
          const column = columns.find((col) => col.status === status);
          const count = column?.items.length ?? 0;
          const isActive = status === activeStatus;

          return (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "bg-surface-2 text-text-3 hover:bg-surface-3",
              )}
            >
              {applicationStatusLabels[status]}
              <span
                className={cn(
                  "flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                  isActive ? "bg-background/20 text-background" : "bg-surface-3 text-text-3",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="mt-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          {errorMessage}
        </div>
      )}

      {/* Cards */}
      <div className="mt-3 flex flex-col gap-3">
        {visibleCards.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No applications in this stage.
          </p>
        ) : (
          visibleCards.map((card) => (
            <DesignCard key={card.id} className={cn(isPending && "opacity-60")}>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{card.company}</p>
                  <p className="text-xs text-muted-foreground">{card.role}</p>
                </div>

                {/* Stage chips — tap to move */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {NON_REJECTED_STATUSES.map((status) => {
                    const isCurrentStatus = activeStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(card.id, status)}
                        disabled={isCurrentStatus || isPending}
                        className={cn(
                          "rounded transition-opacity",
                          isCurrentStatus
                            ? "cursor-default ring-1 ring-border-strong ring-offset-1"
                            : "hover:opacity-80 active:opacity-60",
                        )}
                        aria-label={`Move to ${applicationStatusLabels[status]}`}
                      >
                        <Chip
                          tone={stageTone[status]}
                          label={applicationStatusLabels[status]}
                          size="sm"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </DesignCard>
          ))
        )}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background">
        {(
          [
            { href: "/dashboard", label: "Dashboard" },
            { href: "/pipeline", label: "Pipeline" },
            { href: "/applications", label: "Applications" },
            { href: "/reminders", label: "Reminders" },
          ] as const
        ).map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-medium text-muted-foreground hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Spacer so content doesn't sit under the fixed nav */}
      <div className="h-16" />
    </div>
  );
}
