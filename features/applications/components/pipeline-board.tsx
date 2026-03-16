"use client";

import { useState, useTransition } from "react";

import {
  ApplicationCard,
  type ApplicationCardData,
} from "@/features/applications/components/application-card";
import { ApplicationKanbanColumn } from "@/features/applications/components/application-kanban-column";
import { updateApplicationStatus } from "@/features/applications/server/update-application-status";
import type { PipelineApplicationCard, PipelineColumn } from "@/features/applications/server/pipeline-board";
import type { ApplicationStatusValue } from "@/features/applications/config";

type PipelineBoardProps = {
  initialColumns: PipelineColumn[];
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

function moveCard(
  columns: PipelineColumn[],
  cardId: string,
  nextStatus: ApplicationStatusValue,
) {
  let movedCard: PipelineApplicationCard | null = null;

  const withoutCard = columns.map((column) => {
    const remainingItems = column.items.filter((item) => {
      const shouldKeep = item.id !== cardId;

      if (!shouldKeep) {
        movedCard = item;
      }

      return shouldKeep;
    });

    return {
      ...column,
      items: remainingItems,
    };
  });

  if (!movedCard) {
    return columns;
  }

  const cardToMove: PipelineApplicationCard = movedCard;

  return withoutCard.map((column) =>
    column.status === nextStatus
      ? {
          ...column,
          items: [
            {
              ...cardToMove,
              updatedAt: new Date().toISOString(),
            },
            ...column.items,
          ],
        }
      : column,
  );
}

export function PipelineBoard({ initialColumns }: PipelineBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDrop(nextStatus: ApplicationStatusValue) {
    if (!draggedCardId) {
      return;
    }

    const sourceColumn = columns.find((column) =>
      column.items.some((item) => item.id === draggedCardId),
    );

    if (!sourceColumn || sourceColumn.status === nextStatus) {
      setDraggedCardId(null);
      return;
    }

    const previousColumns = columns;
    const nextColumns = moveCard(columns, draggedCardId, nextStatus);

    setErrorMessage(null);
    setColumns(nextColumns);
    setDraggedCardId(null);

    startTransition(async () => {
      const result = await updateApplicationStatus(draggedCardId, nextStatus);

      if (result.status === "error") {
        setColumns(previousColumns);
        setErrorMessage(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-5">
        {columns.map((column) => (
          <ApplicationKanbanColumn
            key={column.status}
            label={column.label}
            status={column.status}
            items={column.items.map<ApplicationCardData>((item) => ({
              id: item.id,
              company: item.company,
              role: item.role,
              appliedDate: formatDate(item.appliedDate),
              sourceLabel: item.source,
              updatedAt: formatDate(item.updatedAt),
            }))}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(column.status)}
          >
            {column.items.map((item) => (
              <ApplicationCard
                key={item.id}
                item={{
                  id: item.id,
                  company: item.company,
                  role: item.role,
                  appliedDate: formatDate(item.appliedDate),
                  sourceLabel: item.source,
                  updatedAt: formatDate(item.updatedAt),
                }}
                draggable={!isPending}
                onDragStart={() => setDraggedCardId(item.id)}
                onDragEnd={() => setDraggedCardId(null)}
              />
            ))}
          </ApplicationKanbanColumn>
        ))}
      </div>
    </div>
  );
}
