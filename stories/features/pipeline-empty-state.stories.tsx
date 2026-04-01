import type { Meta, StoryObj } from "@storybook/react";

import { PipelineEmptyState } from "@/features/applications/components/pipeline-empty-state";

const meta = {
  title: "Features/PipelineEmptyState",
  component: PipelineEmptyState,
} satisfies Meta<typeof PipelineEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
