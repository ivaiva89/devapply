import { Trophy } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react";

import { StatsCard } from "@/shared/design/stats-card";

const meta = {
  title: "Design/StatsCard",
  component: StatsCard,
  args: {
    label: "Applications this month",
    value: 18,
    helper: "Created since March 1",
  },
} satisfies Meta<typeof StatsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Highlighted: Story = {
  args: {
    label: "Total Applications",
    value: 24,
    helper: "↑ 4 this week",
    highlight: true,
  },
};

export const WithColoredValue: Story = {
  args: {
    label: "Interviews",
    value: 6,
    valueClassName: "text-violet-400",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Offers",
    value: 1,
    icon: Trophy,
  },
};

export const HighlightedWithIcon: Story = {
  args: {
    label: "Total Applications",
    value: 24,
    helper: "↑ 4 this week",
    highlight: true,
    icon: Trophy,
  },
};
