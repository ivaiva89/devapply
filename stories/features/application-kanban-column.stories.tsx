import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationCard } from "@/features/applications/components/application-card";
import { ApplicationKanbanColumn } from "@/features/applications/components/application-kanban-column";
import { mockPipelineColumns } from "@/lib/mocks/ui-fixtures";

function FilledColumn() {
  const column = mockPipelineColumns[1];

  return (
    <ApplicationKanbanColumn
      label={column.label}
      status={column.status}
      items={column.items}
    >
      {column.items.map((item) => (
        <ApplicationCard key={item.id} item={item} />
      ))}
    </ApplicationKanbanColumn>
  );
}

function EmptyColumn() {
  const column = mockPipelineColumns[4];

  return (
    <ApplicationKanbanColumn
      label={column.label}
      status={column.status}
      items={column.items}
    >
      {null}
    </ApplicationKanbanColumn>
  );
}

const meta = {
  title: "Features/ApplicationKanbanColumn",
  component: FilledColumn,
} satisfies Meta<typeof FilledColumn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Empty: StoryObj<typeof EmptyColumn> = {
  render: () => <EmptyColumn />,
};
