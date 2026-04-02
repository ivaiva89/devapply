import type { Meta, StoryObj } from "@storybook/react";

import { DashboardHeader } from "@/widgets/dashboard/ui/dashboard-header";

const meta = {
  title: "Features/Dashboard/DashboardHeader",
  component: DashboardHeader,
  args: {
    title: "Dashboard",
    description:
      "Job search overview — pipeline volume, recent activity, and follow-ups.",
  },
} satisfies Meta<typeof DashboardHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: {
    description: undefined,
  },
};
