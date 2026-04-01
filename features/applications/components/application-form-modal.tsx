"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ApplicationFormModalPresenter } from "@/features/applications/components/application-form-modal-presenter";
import {
  getCreateApplicationInitialState,
  type CreateApplicationActionState,
  type CreateApplicationFormValues,
} from "@/features/applications/create-application-form";

type ApplicationFormAction = (
  state: CreateApplicationActionState,
  formData: FormData,
) => Promise<CreateApplicationActionState>;

type ApplicationFormModalProps = {
  action: ApplicationFormAction;
  description: string;
  initialValues: CreateApplicationFormValues;
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  submitLabel: string;
  submittingLabel: string;
  title: string;
};

export function ApplicationFormModal({
  action,
  description,
  initialValues,
  isOpen,
  onCancel,
  onSuccess,
  submitLabel,
  submittingLabel,
  title,
}: ApplicationFormModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    action,
    getCreateApplicationInitialState(initialValues),
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
    <ApplicationFormModalPresenter
      action={formAction}
      description={description}
      isOpen={isOpen}
      isPending={isPending}
      onCancel={onCancel}
      state={state}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      title={title}
    />
  );
}
