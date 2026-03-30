import type { Meta, StoryObj } from "@storybook/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function DemoTable() {
  return (
    <div className="w-[720px] rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-foreground">
              Vercel
            </TableCell>
            <TableCell>Product Engineer</TableCell>
            <TableCell>Interview</TableCell>
            <TableCell className="text-right">Mar 18</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium text-foreground">
              Linear
            </TableCell>
            <TableCell>Frontend Engineer</TableCell>
            <TableCell>Applied</TableCell>
            <TableCell className="text-right">Mar 16</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

const meta = {
  title: "UI/Table",
  component: DemoTable,
} satisfies Meta<typeof DemoTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
