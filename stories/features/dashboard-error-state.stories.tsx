import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/shared/ui/button";
import { DashboardErrorState } from "@/widgets/dashboard/ui/dashboard-error-state";

const meta = {
  title: "Features/Dashboard/DashboardErrorState",
  component: DashboardErrorState,
  args: {
    description: "Unable to load your latest dashboard metrics.",
  },
} satisfies Meta<typeof DashboardErrorState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRetry: Story = {
  args: {
    action: <Button type="button">Try again</Button>,
  },
};
