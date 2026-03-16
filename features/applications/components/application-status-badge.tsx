import { StatusBadge } from "@/components/design/status-badge";
import {
  applicationStatusLabels,
  applicationStatusTones,
  type ApplicationStatusValue,
} from "@/features/applications/config";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatusValue;
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <StatusBadge
      label={applicationStatusLabels[status]}
      tone={applicationStatusTones[status]}
    />
  );
}
