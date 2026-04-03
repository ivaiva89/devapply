import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type ApplicationRowActionsMenuProps = {
  onDelete?: () => void;
  onEdit?: () => void;
};

export function ApplicationRowActionsMenu({
  onDelete,
  onEdit,
}: ApplicationRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 rounded-full border border-border/70 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
            aria-label="Open application actions"
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 rounded-2xl p-1.5"
      >
        <DropdownMenuItem
          onClick={() => {
            onEdit?.();
          }}
          className="min-h-10 rounded-xl px-3"
        >
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onDelete?.();
          }}
          variant="destructive"
          className="min-h-10 rounded-xl px-3"
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
