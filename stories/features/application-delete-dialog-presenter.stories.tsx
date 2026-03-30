import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationDeleteDialogPresenter } from "@/features/applications/components/application-delete-dialog-presenter";

const meta = {
  title: "Features/Applications/ApplicationDeleteDialogPresenter",
  component: ApplicationDeleteDialogPresenter,
  args: {
    company: "Linear",
    isOpen: true,
    onCancel: () => undefined,
  },
} satisfies Meta<typeof ApplicationDeleteDialogPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: "This application could not be deleted.",
  },
};
