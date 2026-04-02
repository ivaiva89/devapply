import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/shared/ui/button";
import { PlanSummaryPresenter } from "@/widgets/settings-billing/ui/plan-summary-presenter";

const meta = {
  title: "Features/Billing/PlanSummaryPresenter",
  component: PlanSummaryPresenter,
  args: {
    plan: "FREE",
    actions: (
      <>
        <Button>Upgrade to Pro</Button>
        <Button variant="outline">Manage existing billing</Button>
      </>
    ),
  },
} satisfies Meta<typeof PlanSummaryPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FreePlan: Story = {};

export const ProPlan: Story = {
  args: {
    plan: "PRO",
    actions: <Button variant="outline">Manage billing</Button>,
  },
};
