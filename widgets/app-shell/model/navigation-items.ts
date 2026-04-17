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
  hotkey: string;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, hotkey: "G D" },
  { href: "/applications", label: "Applications", icon: BriefcaseBusiness, hotkey: "G A" },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare, hotkey: "G P" },
  { href: "/resumes", label: "Resumes", icon: FileText, hotkey: "G R" },
  { href: "/reminders", label: "Reminders", icon: BellRing, hotkey: "G N" },
  { href: "/settings", label: "Settings", icon: Settings2, hotkey: "G S" },
];
