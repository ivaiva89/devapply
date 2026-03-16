import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationsTable } from "@/features/applications/components/applications-table";

const meta = {
  title: "Features/ApplicationsTable",
  component: ApplicationsTable,
  args: {
    applications: [
      {
        id: "1",
        company: "Stripe",
        role: "Frontend Engineer",
        location: "Remote - US",
        status: "INTERVIEW",
        appliedDate: "Mar 10, 2026",
        sourceLabel: "LinkedIn",
        source: "LINKEDIN",
        lastActivity: "Mar 12, 2026",
      },
      {
        id: "2",
        company: "Linear",
        role: "Software Engineer",
        location: "New York, NY",
        status: "APPLIED",
        appliedDate: "Mar 9, 2026",
        sourceLabel: "Company site",
        source: "COMPANY_SITE",
        lastActivity: "Mar 10, 2026",
      },
    ],
  },
} satisfies Meta<typeof ApplicationsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
