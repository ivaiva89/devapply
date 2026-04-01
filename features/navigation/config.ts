import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  BriefcaseBusiness,
  FileText,
  KanbanSquare,
  LayoutDashboard,
  Settings2,
} from "lucide-react";

export const marketingNavigation = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

export const appNavigation: ReadonlyArray<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/reminders", label: "Reminders", icon: BellRing },
  { href: "/settings", label: "Settings", icon: Settings2 },
];
