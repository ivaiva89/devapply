import type { MouseEvent } from "react";

import { Button } from "@/shared/ui/button";

type ApplicationRowActionsMenuProps = {
  onDelete?: () => void;
  onEdit?: () => void;
};

function closeActionsMenu(event: MouseEvent<HTMLButtonElement>) {
  const menu = event.currentTarget.closest("details");

  if (menu instanceof HTMLDetailsElement) {
    menu.open = false;
  }
}

export function ApplicationRowActionsMenu({
  onDelete,
  onEdit,
}: ApplicationRowActionsMenuProps) {
  return (
    <details className="relative">
      <summary className="list-none rounded-full border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-foreground hover:text-foreground">
        Actions
      </summary>
      <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-2xl border border-border bg-card p-2 shadow-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(event) => {
            closeActionsMenu(event);
            onEdit?.();
          }}
          className="w-full justify-start rounded-xl px-3"
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(event) => {
            closeActionsMenu(event);
            onDelete?.();
          }}
          className="mt-1 w-full justify-start rounded-xl px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Delete
        </Button>
      </div>
    </details>
  );
}
