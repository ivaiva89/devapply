import type { Meta, StoryObj } from "@storybook/react";

import { AppSidebarPresenter } from "@/features/navigation/components/app-sidebar-presenter";

const meta = {
  title: "Features/Navigation/AppSidebarPresenter",
  component: AppSidebarPresenter,
  args: {
    currentPath: "/applications",
  },
  parameters: {
    layout: "fullscreen",
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
