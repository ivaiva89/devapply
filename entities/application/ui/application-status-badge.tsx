import { StatusBadge } from "@/shared/design/status-badge";
import {
  applicationStatusLabels,
  applicationStatusTones,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";

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
