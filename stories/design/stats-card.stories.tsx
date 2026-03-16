import type { Meta, StoryObj } from "@storybook/react";

import { StatsCard } from "@/components/design/stats-card";

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
