import type { Meta, StoryObj } from "@storybook/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DemoTabs() {
  return (
    <Tabs defaultValue="dashboard" className="w-[720px]">
      <TabsList>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent
        value="dashboard"
        className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        Dashboard preview content
      </TabsContent>
      <TabsContent
        value="applications"
        className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        Applications screen preview content
      </TabsContent>
      <TabsContent
        value="billing"
        className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm"
      >
        Billing settings preview content
      </TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "UI/Tabs",
  component: DemoTabs,
} satisfies Meta<typeof DemoTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
