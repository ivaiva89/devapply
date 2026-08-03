"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ApplicationDeleteDialog } from "@/features/applications/components/application-delete-dialog";
import { ApplicationFormModal } from "@/features/applications/components/application-form-modal";
import { getApplicationFormValues } from "@/features/applications/create-application-form";
import { updateApplication } from "@/features/applications/server/update-application";
import type { ApplicationListItem } from "@/entities/application/model/types";
import { DesignButton } from "@/shared/design/button";
import { cn } from "@/shared/lib/utils";

type ApplicationDetailActionsProps = {
  application: ApplicationListItem;
};

export function ApplicationDetailActions({
  application,
}: ApplicationDetailActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <DesignButton
        type="button"
        variant="ghost"
        className={cn("text-danger hover:bg-danger-soft hover:text-danger")}
        onClick={() => setIsDeleting(true)}
      >
        Delete
      </DesignButton>
      <DesignButton
        type="button"
        variant="secondary"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </DesignButton>

      {isEditing ? (
        <ApplicationFormModal
          key={application.id}
          action={updateApplication.bind(null, application.id)}
          description={`Update ${application.company} without leaving this page.`}
          initialValues={getApplicationFormValues(application)}
          isOpen={isEditing}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
          submitLabel="Save changes"
          submittingLabel="Saving..."
          title="Edit application"
        />
      ) : null}

      {isDeleting ? (
        <ApplicationDeleteDialog
          applicationId={application.id}
          company={application.company}
          isOpen={isDeleting}
          onCancel={() => setIsDeleting(false)}
          onSuccess={() => {
            setIsDeleting(false);
            router.push("/applications");
          }}
        />
      ) : null}
    </>
  );
}
