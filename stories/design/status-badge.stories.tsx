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

export const Neutral: Story = {
  args: { label: "Wishlist", tone: "neutral" },
};

export const Info: Story = {
  args: { label: "Applied", tone: "info" },
};

export const Warning: Story = {
  args: { label: "Interview", tone: "warning" },
};

export const Success: Story = {
  args: { label: "Offer", tone: "success" },
};

export const Danger: Story = {
  args: { label: "Rejected", tone: "danger" },
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge label="Wishlist" tone="neutral" />
      <StatusBadge label="Applied" tone="info" />
      <StatusBadge label="Interview" tone="warning" />
      <StatusBadge label="Offer" tone="success" />
      <StatusBadge label="Rejected" tone="danger" />
    </div>
  ),
};
