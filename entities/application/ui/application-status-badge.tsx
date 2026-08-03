import { Chip } from "@/shared/design/chip";
import {
  applicationStatusChipTones,
  applicationStatusLabels,
  type ApplicationStatusValue,
} from "@/entities/application/model/config";

type ApplicationStatusBadgeProps = {
  status: ApplicationStatusValue;
  size?: "sm" | "default";
};

export function ApplicationStatusBadge({
  status,
  size = "sm",
}: ApplicationStatusBadgeProps) {
  return (
    <Chip
      tone={applicationStatusChipTones[status]}
      label={applicationStatusLabels[status]}
      size={size}
    />
  );
}
