import { Briefcase, CalendarPlus, MessageSquare, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatsCard } from "@/components/design/stats-card";

type StatsGridItem = {
  label: string;
  value: number;
  helper: string;
};

type StatsGridProps = {
  items: StatsGridItem[];
};

// Ordered to match the four KPIs returned from getDashboardDataForUser.
const SLOT_ICONS: [LucideIcon, LucideIcon, LucideIcon, LucideIcon] = [
  Briefcase,
  CalendarPlus,
  MessageSquare,
  Trophy,
];

const SLOT_VALUE_CLASSNAMES: [undefined, undefined, string, string] = [
  undefined, // slot 0: total applications — default (primary card handles color)
  undefined, // slot 1: applications this month
  "text-violet-400", // slot 2: interviews
  "text-emerald-400", // slot 3: offers
];

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatsCard
          key={item.label}
          label={item.label}
          value={item.value}
          helper={item.helper}
          icon={SLOT_ICONS[index]}
          highlight={index === 0}
          valueClassName={SLOT_VALUE_CLASSNAMES[index]}
        />
      ))}
    </div>
  );
}
