"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getDeleteApplicationInitialState } from "@/features/applications/application-delete";
import { deleteApplication } from "@/features/applications/server/delete-application";

type ApplicationDeleteDialogProps = {
  applicationId: string;
  company: string;
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export function ApplicationDeleteDialog({
  applicationId,
  company,
  isOpen,
  onCancel,
  onSuccess,
}: ApplicationDeleteDialogProps) {
  const router = useRouter();
  const deleteAction = deleteApplication.bind(null, applicationId);
  const [state, formAction, isPending] = useActionState(
    deleteAction,
    getDeleteApplicationInitialState(),
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    onSuccess();
    startTransition(() => {
      router.refresh();
    });
  }, [onSuccess, router, state.status]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-application-heading"
        className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-6 shadow-2xl sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Applications
        </p>
        <h2
          id="delete-application-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-stone-950"
        >
          Delete application
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Delete <span className="font-medium text-stone-950">{company}</span>?
          This action cannot be undone.
        </p>
        {state.error ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        <form action={formAction} className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isPending ? "Deleting..." : "Delete application"}
          </button>
        </form>
      </div>
    </div>
  );
}
