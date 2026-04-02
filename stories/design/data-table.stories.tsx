import type { Meta, StoryObj } from "@storybook/react";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/design/data-table";

type Row = {
  id: string;
  company: string;
  role: string;
  status: string;
};

const rows: Row[] = [
  {
    id: "1",
    company: "Stripe",
    role: "Frontend Engineer",
    status: "Interview",
  },
  { id: "2", company: "Linear", role: "Software Engineer", status: "Applied" },
];

const columns: DataTableColumn<Row>[] = [
  { key: "company", header: "Company", cell: (row) => row.company },
  { key: "role", header: "Role", cell: (row) => row.role },
  { key: "status", header: "Status", cell: (row) => row.status },
];

function DemoTable() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      emptyTitle="No rows"
      emptyDescription="Rows will appear here when data is available."
    />
  );
}

const meta = {
  title: "Design/DataTable",
  component: DemoTable,
} satisfies Meta<typeof DemoTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
