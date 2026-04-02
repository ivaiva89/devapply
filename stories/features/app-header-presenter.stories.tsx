import type { Meta, StoryObj } from "@storybook/react";

import { AppHeaderPresenter } from "@/widgets/app-shell/ui/app-header-presenter";
import { mockNavigationShellUser } from "@/shared/mocks/ui-fixtures";
import { Button } from "@/shared/ui/button";

const meta = {
  title: "Features/Navigation/AppHeaderPresenter",
  component: AppHeaderPresenter,
  args: {
    currentPath: "/dashboard",
    title: "Application tracker",
    description:
      "Protected area for managing applications, interview progress, reminders, and resume assets.",
    userName: mockNavigationShellUser.name,
    userEmail: mockNavigationShellUser.email,
    planLabel: mockNavigationShellUser.planLabel,
    userControl: <Button variant="outline">Sign out</Button>,
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
    currentPath: "/settings",
    title: undefined,
    description: undefined,
    planLabel: "FREE",
  },
};
