import type { Meta, StoryObj } from "@storybook/react";

import { StatusBadge } from "@/components/design/status-badge";

const meta = {
  title: "Design/StatusBadge",
  component: StatusBadge,
  args: {
    label: "Interview",
    tone: "warning",
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Warning: Story = {};

export const Success: Story = {
  args: {
    label: "Offer",
    tone: "success",
  },
};
