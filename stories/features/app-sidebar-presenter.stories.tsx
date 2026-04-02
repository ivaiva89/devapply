import type { Meta, StoryObj } from "@storybook/react";

import { AppSidebarPresenter } from "@/widgets/app-shell/ui/app-sidebar-presenter";

const meta = {
  title: "Features/Navigation/AppSidebarPresenter",
  component: AppSidebarPresenter,
  args: {
    currentPath: "/applications",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AppSidebarPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ApplicationsActive: Story = {};

export const SettingsActive: Story = {
  args: {
    currentPath: "/settings",
  },
};
