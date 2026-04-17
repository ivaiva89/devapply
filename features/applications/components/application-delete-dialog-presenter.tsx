import type { ComponentProps } from "react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type ApplicationDeleteDialogPresenterProps = {
  action?: ComponentProps<"form">["action"];
  company: string;
  error?: string;
  isOpen: boolean;
  isPending?: boolean;
  onCancel?: () => void;
};

export function ApplicationDeleteDialogPresenter({
  action,
  company,
  error,
  isOpen,
  isPending = false,
  onCancel,
}: ApplicationDeleteDialogPresenterProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={
        onCancel ? (open) => (!open ? onCancel() : undefined) : undefined
      }
    >
      <DialogContent className="max-w-lg rounded-[2rem] p-6 sm:p-8">
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-text-3">
            Applications
          </p>
          <DialogTitle className="text-2xl tracking-tight">
            Delete application
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            Delete{" "}
            <span className="font-medium text-text">{company}</span>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        ) : null}

        <form action={action}>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
