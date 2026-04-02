import type { Meta, StoryObj } from "@storybook/react";

import { SidebarProvider } from "@/shared/ui/sidebar";
import { AppSidebarPresenter } from "@/widgets/app-shell/ui/app-sidebar-presenter";

const meta = {
  title: "Features/Navigation/AppSidebarPresenter",
  component: AppSidebarPresenter,
  args: {
    currentPath: "/applications",
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="min-h-screen bg-background p-4">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSidebarPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ApplicationsActive: Story = {};

export const SettingsActive: Story = {
  args: {
    currentPath: "/settings",
  },
};
