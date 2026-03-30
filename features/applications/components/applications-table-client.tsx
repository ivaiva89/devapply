"use client";

import { useState } from "react";

import { ApplicationsTable, type ApplicationTableRow } from "@/features/applications/components/applications-table";
import { ApplicationDeleteDialog } from "@/features/applications/components/application-delete-dialog";
import { ApplicationFormModal } from "@/features/applications/components/application-form-modal";
import { ApplicationRowActionsMenu } from "@/features/applications/components/application-row-actions-menu";
import { applicationSourceLabels } from "@/features/applications/config";
import { getApplicationFormValues } from "@/features/applications/create-application-form";
import { updateApplication } from "@/features/applications/server/update-application";
import type { ApplicationListItem } from "@/features/applications/types";

type ApplicationsTableClientProps = {
  applications: ApplicationListItem[];
};

type TableFeedback = {
  tone: "error" | "success";
  message: string;
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

type RowActionsMenuProps = {
  application: ApplicationListItem;
  onDelete: (application: ApplicationListItem) => void;
  onEdit: (application: ApplicationListItem) => void;
};

function RowActionsMenu({
  application,
  onDelete,
  onEdit,
}: RowActionsMenuProps) {
  return (
    <ApplicationRowActionsMenu
      onEdit={() => onEdit(application)}
      onDelete={() => onDelete(application)}
    />
  );
}

export function ApplicationsTableClient({
  applications,
}: ApplicationsTableClientProps) {
  const [feedback, setFeedback] = useState<TableFeedback | null>(null);
  const [editingApplication, setEditingApplication] =
    useState<ApplicationListItem | null>(null);
  const [deletingApplication, setDeletingApplication] =
    useState<ApplicationListItem | null>(null);

  const rows: ApplicationTableRow[] = applications.map((application) => ({
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location?.trim() || "Not set",
    status: application.status,
    appliedDate: formatDate(application.appliedDate),
    sourceLabel: applicationSourceLabels[application.source],
    source: application.source,
    lastActivity: formatDate(application.updatedAt),
    actions: (
      <RowActionsMenu
        application={application}
        onDelete={setDeletingApplication}
        onEdit={setEditingApplication}
      />
    ),
  }));

  return (
    <div className="space-y-4">
      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <p>{feedback.message}</p>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-sm font-medium transition hover:opacity-70"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
      <ApplicationsTable applications={rows} />
      {editingApplication ? (
        <ApplicationFormModal
          key={editingApplication.id}
          action={updateApplication.bind(null, editingApplication.id)}
          description={`Update ${editingApplication.company} without leaving the current table.`}
          initialValues={getApplicationFormValues(editingApplication)}
          isOpen={Boolean(editingApplication)}
          onCancel={() => {
            setEditingApplication(null);
          }}
          onSuccess={() => {
            setFeedback({
              tone: "success",
              message: `Updated ${editingApplication.company}.`,
            });
            setEditingApplication(null);
          }}
          submitLabel="Save changes"
          submittingLabel="Saving..."
          title="Edit application"
        />
      ) : null}
      {deletingApplication ? (
        <ApplicationDeleteDialog
          applicationId={deletingApplication.id}
          company={deletingApplication.company}
          isOpen={Boolean(deletingApplication)}
          onCancel={() => {
            setDeletingApplication(null);
          }}
          onSuccess={() => {
            setFeedback({
              tone: "success",
              message: `Deleted ${deletingApplication.company}.`,
            });
            setDeletingApplication(null);
          }}
        />
      ) : null}
    </div>
  );
}
