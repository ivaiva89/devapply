import { notFound } from "next/navigation";

import { getApplicationByIdForUser } from "@/features/applications/server/application-detail";
import { requireCurrentUser } from "@/features/auth/server/session";
import type { ApplicationListItem } from "@/entities/application/model/types";
import type {
  ApplicationSourceValue,
  ApplicationStatusValue,
} from "@/entities/application/model/config";
import {
  ApplicationDetail,
  ApplicationDetailActions,
  toApplicationDetailView,
} from "@/widgets/application-detail";

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const user = await requireCurrentUser();
  const { id } = await params;

  const application = await getApplicationByIdForUser(user.id, id);
  if (!application) {
    notFound();
  }

  const view = toApplicationDetailView(application);
  const listItem: ApplicationListItem = {
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location,
    status: application.status as ApplicationStatusValue,
    source: application.source as ApplicationSourceValue,
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    currency: application.currency,
    jobUrl: application.jobUrl,
    notes: application.notes,
    appliedDate: application.appliedDate,
    lastActivityAt: application.lastActivityAt,
    updatedAt: application.updatedAt,
  };

  return (
    <div className="min-w-0 space-y-6">
      <ApplicationDetail
        view={view}
        actions={<ApplicationDetailActions application={listItem} />}
      />
    </div>
  );
}
