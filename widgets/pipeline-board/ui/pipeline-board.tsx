"use client";

import { useState, useTransition } from "react";

import { PipelineBoardPresenter } from "@/widgets/pipeline-board/ui/pipeline-board-presenter";
import { updateApplicationStatus } from "@/features/applications/server/update-application-status";
import type {
  PipelineApplicationCard,
  PipelineColumn,
} from "@/features/applications/server/pipeline-board";
import type { ApplicationStatusValue } from "@/entities/application/model/config";

type PipelineBoardProps = {
  initialColumns: PipelineColumn[];
};

function moveCard(
  columns: PipelineColumn[],
  cardId: string,
  nextStatus: ApplicationStatusValue,
) {
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

export function PipelineBoard({ initialColumns }: PipelineBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragTargetStatus, setDragTargetStatus] = useState<ApplicationStatusValue | null>(null);
  const [flashCardId, setFlashCardId] = useState<string | null>(null);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateCardStatus(cardId: string, nextStatus: ApplicationStatusValue) {
    const sourceColumn = columns.find((col) => col.items.some((item) => item.id === cardId));
    if (!sourceColumn || sourceColumn.status === nextStatus) {
      setDraggedCardId(null);
      setDragTargetStatus(null);
      return;
    }

    const previousColumns = columns;
    const nextColumns = moveCard(columns, cardId, nextStatus);

    setErrorMessage(null);
    setColumns(nextColumns);
    setDraggedCardId(null);
    setDragTargetStatus(null);
    setFlashCardId(cardId);
    setTimeout(() => setFlashCardId(null), 1200);

    startTransition(async () => {
      const result = await updateApplicationStatus(cardId, nextStatus);
      if (result.status === "error") {
        setColumns(previousColumns);
        setErrorMessage(result.message);
      }
    });
  }

  function handleDrop(nextStatus: ApplicationStatusValue) {
    if (!draggedCardId) return;
    updateCardStatus(draggedCardId, nextStatus);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!focusedCardId) return;

    const allCards = columns.flatMap((col) =>
      col.items.map((item) => ({ id: item.id, status: col.status })),
    );
    const currentIndex = allCards.findIndex((c) => c.id === focusedCardId);
    if (currentIndex === -1) return;

    if (event.key === "j" || event.key === "J") {
      event.preventDefault();
      const next = allCards[currentIndex + 1];
      if (next) {
        setFocusedCardId(next.id);
        document.querySelector<HTMLElement>(`[data-card-id="${next.id}"]`)?.focus();
      }
      return;
    }

    if (event.key === "k" || event.key === "K") {
      event.preventDefault();
      const prev = allCards[currentIndex - 1];
      if (prev) {
        setFocusedCardId(prev.id);
        document.querySelector<HTMLElement>(`[data-card-id="${prev.id}"]`)?.focus();
      }
      return;
    }

    // Map 1-4 to the first 4 non-rejected statuses
    const nonRejectedStatuses = columns
      .filter((col) => col.status !== "REJECTED")
      .map((col) => col.status);

    const stageByKey: Record<string, ApplicationStatusValue> = {};
    nonRejectedStatuses.forEach((status, i) => {
      stageByKey[String(i + 1)] = status;
    });

    if (event.key in stageByKey) {
      event.preventDefault();
      updateCardStatus(focusedCardId, stageByKey[event.key]);
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="outline-none">
      <PipelineBoardPresenter
        columns={columns}
        errorMessage={errorMessage}
        isPending={isPending}
        dragTargetStatus={dragTargetStatus}
        flashCardId={flashCardId}
        focusedCardId={focusedCardId}
        onFocusCard={setFocusedCardId}
        onCardDragEnd={() => { setDraggedCardId(null); setDragTargetStatus(null); }}
        onCardDragStart={setDraggedCardId}
        onCardStatusChange={updateCardStatus}
        onColumnDragEnter={setDragTargetStatus}
        onColumnDragOver={(event) => event.preventDefault()}
        onColumnDrop={handleDrop}
      />
    </div>
  );
}
