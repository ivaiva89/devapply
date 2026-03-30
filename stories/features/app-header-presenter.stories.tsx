import type { Meta, StoryObj } from "@storybook/react";

import { AppHeaderPresenter } from "@/features/navigation/components/app-header-presenter";
import { mockNavigationShellUser } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Navigation/AppHeaderPresenter",
  component: AppHeaderPresenter,
  args: {
    title: "Application tracker",
    description:
      "Protected area for managing applications, interview progress, reminders, and resume assets.",
    userName: mockNavigationShellUser.name,
    userEmail: mockNavigationShellUser.email,
    planLabel: mockNavigationShellUser.planLabel,
    userControl: (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
        AJ
      </div>
    ),
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeaderPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: {
    title: undefined,
    description: undefined,
    planLabel: "FREE",
  },
};
