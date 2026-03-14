import type { ApplicationStatus } from "@prisma/client";

const statusClasses: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-stone-100 text-stone-700",
  APPLIED: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-amber-100 text-amber-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus;
};

export function ApplicationStatusBadge({
  status,
}: ApplicationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
