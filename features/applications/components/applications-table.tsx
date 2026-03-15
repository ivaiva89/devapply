"use client";

import { useState, type MouseEvent } from "react";

import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";
import { ApplicationDeleteDialog } from "@/features/applications/components/application-delete-dialog";
import { ApplicationFormModal } from "@/features/applications/components/application-form-modal";
import { applicationSourceLabels } from "@/features/applications/config";
import { getApplicationFormValues } from "@/features/applications/create-application-form";
import { updateApplication } from "@/features/applications/server/update-application";
import type { ApplicationListItem } from "@/features/applications/types";

type ApplicationsTableProps = {
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

function closeActionsMenu(event: MouseEvent<HTMLButtonElement>) {
  const menu = event.currentTarget.closest("details");

  if (menu instanceof HTMLDetailsElement) {
    menu.open = false;
  }
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
    <details className="relative">
      <summary className="list-none rounded-full border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950">
        Actions
      </summary>
      <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg">
        <button
          type="button"
          onClick={(event) => {
            closeActionsMenu(event);
            onEdit(application);
          }}
          className="w-full rounded-xl px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={(event) => {
            closeActionsMenu(event);
            onDelete(application);
          }}
          className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </details>
  );
}

export function ApplicationsTable({
  applications,
}: ApplicationsTableProps) {
  const [feedback, setFeedback] = useState<TableFeedback | null>(null);
  const [editingApplication, setEditingApplication] =
    useState<ApplicationListItem | null>(null);
  const [deletingApplication, setDeletingApplication] =
    useState<ApplicationListItem | null>(null);

  return (
    <div className="space-y-4">
      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
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
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Applied date</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {applications.map((application) => (
                <tr key={application.id} className="align-top text-sm text-stone-700">
                  <td className="px-5 py-4 font-medium text-stone-950">
                    {application.company}
                  </td>
                  <td className="px-5 py-4">{application.role}</td>
                  <td className="px-5 py-4">
                    <ApplicationStatusBadge status={application.status} />
                  </td>
                  <td className="px-5 py-4">{formatDate(application.appliedDate)}</td>
                  <td className="px-5 py-4">
                    {applicationSourceLabels[application.source]}
                  </td>
                  <td className="px-5 py-4">{formatDate(application.updatedAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <RowActionsMenu
                      application={application}
                      onDelete={(nextApplication) => {
                        setDeletingApplication(nextApplication);
                      }}
                      onEdit={(nextApplication) => {
                        setEditingApplication(nextApplication);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
