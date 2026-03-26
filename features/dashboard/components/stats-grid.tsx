import {
  Briefcase,
  CalendarPlus,
  MessageSquare,
  Trophy,
} from "lucide-react";
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
const SLOT_ICONS: LucideIcon[] = [Briefcase, CalendarPlus, MessageSquare, Trophy];

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <StatsCard
          key={item.label}
          label={item.label}
          value={item.value}
          helper={item.helper}
          icon={SLOT_ICONS[index]}
        />
      ))}
    </div>
  );
}
