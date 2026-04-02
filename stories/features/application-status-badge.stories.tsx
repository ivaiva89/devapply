import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationStatusBadge } from "@/entities/application/ui/application-status-badge";

const meta = {
  title: "Features/ApplicationStatusBadge",
  component: ApplicationStatusBadge,
  args: {
    status: "INTERVIEW",
  },
} satisfies Meta<typeof ApplicationStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interview: Story = {};

export const Offer: Story = {
  args: {
    status: "OFFER",
  },
};

export const Rejected: Story = {
  args: {
    status: "REJECTED",
  },
};
