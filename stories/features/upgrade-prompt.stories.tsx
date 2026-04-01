import type { Meta, StoryObj } from "@storybook/react";

import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

const meta = {
  title: "Features/UpgradePrompt",
  component: UpgradePrompt,
  args: {
    title: "Upgrade to keep tracking more applications.",
    description:
      "Free plan users can track 30 applications. Upgrade to Pro to remove the application limit and keep a larger search pipeline active.",
  },
} satisfies Meta<typeof UpgradePrompt>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
