import { applicationSourceLabels } from "@/features/applications/server/application-list";
import type { ApplicationListItem } from "@/features/applications/types";
import { ApplicationStatusBadge } from "@/features/applications/components/application-status-badge";

type ApplicationsTableProps = {
  applications: ApplicationListItem[];
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

export function ApplicationsTable({
  applications,
}: ApplicationsTableProps) {
  return (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
