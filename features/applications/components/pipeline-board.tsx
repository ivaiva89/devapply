"use client";

import { useState, useTransition } from "react";

import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
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
          <section
            key={column.status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(column.status)}
            className="flex min-h-[24rem] flex-col rounded-3xl border border-black/10 bg-white shadow-sm"
          >
            <header className="border-b border-stone-200 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <ApplicationStatusBadge status={column.status} />
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                  {column.items.length}
                </span>
              </div>
              <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                {column.label}
              </h2>
            </header>
            <div className="flex-1 space-y-3 p-4">
              {column.items.length > 0 ? (
                column.items.map((item) => (
                  <article
                    key={item.id}
                    draggable={!isPending}
                    onDragStart={() => setDraggedCardId(item.id)}
                    onDragEnd={() => setDraggedCardId(null)}
                    className="cursor-grab rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-stone-300 active:cursor-grabbing"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-950">
                          {item.company}
                        </p>
                        <p className="text-sm text-stone-600">{item.role}</p>
                      </div>
                      <dl className="space-y-1 text-xs text-stone-500">
                        <div className="flex justify-between gap-3">
                          <dt>Applied</dt>
                          <dd>{formatDate(item.appliedDate)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt>Source</dt>
                          <dd>{item.source}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt>Updated</dt>
                          <dd>{formatDate(item.updatedAt)}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-sm leading-6 text-stone-500">
                  No applications in this column yet.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
