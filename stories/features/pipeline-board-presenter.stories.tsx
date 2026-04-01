import type { Meta, StoryObj } from "@storybook/react";

import { PipelineBoardPresenter } from "@/features/applications/components/pipeline-board-presenter";
import { mockPipelineBoardColumns } from "@/lib/mocks/ui-fixtures";

const meta = {
  title: "Features/Applications/PipelineBoardPresenter",
  component: PipelineBoardPresenter,
  args: {
    columns: mockPipelineBoardColumns,
    onCardStatusChange: () => undefined,
  },
} satisfies Meta<typeof PipelineBoardPresenter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    errorMessage: "Pipeline status update could not be saved.",
  },
};
