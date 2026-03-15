"use client";

import { useState } from "react";

import { ApplicationFormModal } from "@/features/applications/components/application-form-modal";
import { createApplicationDefaultValues } from "@/features/applications/create-application-form";
import { createApplication } from "@/features/applications/server/create-application";

type NewApplicationModalProps = {
  disabled?: boolean;
};

export function NewApplicationModal({
  disabled = false,
}: NewApplicationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={disabled}
        className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        New application
      </button>
      {isOpen ? (
        <ApplicationFormModal
          action={createApplication}
          description="Add a new application without leaving the current list and filters."
          initialValues={createApplicationDefaultValues}
          isOpen={isOpen}
          onCancel={closeModal}
          onSuccess={closeModal}
          submitLabel="Create application"
          submittingLabel="Saving..."
          title="New application"
        />
      ) : null}
    </>
  );
}
