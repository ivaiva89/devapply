import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationRowActionsMenu } from "@/features/applications/components/application-row-actions-menu";

const meta = {
  title: "Features/Applications/ApplicationRowActionsMenu",
  component: ApplicationRowActionsMenu,
} satisfies Meta<typeof ApplicationRowActionsMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
