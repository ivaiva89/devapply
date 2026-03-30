"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getDeleteApplicationInitialState } from "@/features/applications/application-delete";
import { ApplicationDeleteDialogPresenter } from "@/features/applications/components/application-delete-dialog-presenter";
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
    if (state.status !== "success") {
      return;
    }

    onSuccess();
    startTransition(() => {
      router.refresh();
    });
  }, [onSuccess, router, state.status]);

  return (
    <ApplicationDeleteDialogPresenter
      action={formAction}
      company={company}
      error={state.error}
      isOpen={isOpen}
      isPending={isPending}
      onCancel={onCancel}
    />
  );
}
