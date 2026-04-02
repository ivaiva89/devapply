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

  function updateCardStatus(
    cardId: string,
    nextStatus: ApplicationStatusValue,
  ) {
    const sourceColumn = columns.find((column) =>
      column.items.some((item) => item.id === cardId),
    );

    if (!sourceColumn || sourceColumn.status === nextStatus) {
      setDraggedCardId(null);
      return;
    }

    const previousColumns = columns;
    const nextColumns = moveCard(columns, cardId, nextStatus);

    setErrorMessage(null);
    setColumns(nextColumns);
    setDraggedCardId(null);

    startTransition(async () => {
      const result = await updateApplicationStatus(cardId, nextStatus);

      if (result.status === "error") {
        setColumns(previousColumns);
        setErrorMessage(result.message);
      }
    });
  }

  function handleDrop(nextStatus: ApplicationStatusValue) {
    if (!draggedCardId) {
      return;
    }

    updateCardStatus(draggedCardId, nextStatus);
  }

  return (
    <PipelineBoardPresenter
      columns={columns}
      errorMessage={errorMessage}
      isPending={isPending}
      onCardDragEnd={() => setDraggedCardId(null)}
      onCardDragStart={setDraggedCardId}
      onCardStatusChange={updateCardStatus}
      onColumnDragOver={(event) => event.preventDefault()}
      onColumnDrop={handleDrop}
    />
  );
}
