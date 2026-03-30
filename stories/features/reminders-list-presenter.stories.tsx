import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { RemindersListPresenter } from "@/features/reminders/components/reminders-list-presenter";
import { mockReminderListItems } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Reminders/RemindersListPresenter",
  component: RemindersListPresenter,
  args: {
    reminders: mockReminderListItems,
    renderActions: () => (
      <>
        <Button size="sm" variant="outline">
          Mark done
        </Button>
        <Button size="sm">Mark sent</Button>
      </>
    ),
  },
} satisfies Meta<typeof RemindersListPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutActions: Story = {
  args: {
    renderActions: undefined,
  },
};
