import type { Meta, StoryObj } from "@storybook/react";

import { BillingActionButtonPresenter } from "@/features/billing/components/billing-action-button-presenter";

const meta = {
  title: "Features/Billing/BillingActionButtonPresenter",
  component: BillingActionButtonPresenter,
  args: {
    label: "Upgrade to Pro",
    pendingLabel: "Redirecting...",
  },
} satisfies Meta<typeof BillingActionButtonPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    label: "Manage billing",
    pendingLabel: "Opening...",
    variant: "outline",
  },
};

export const WithError: Story = {
  args: {
    error: "Polar checkout could not be started. Try again.",
  },
};
