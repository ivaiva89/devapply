import { PageHeader } from "@/shared/design/page-header";
import { requireCurrentUser } from "@/features/auth/server/session";
import { PLAN_LABELS } from "@/features/billing/config";
import { prisma } from "@/shared/lib/prisma";
import { AppearanceCard } from "@/widgets/settings-billing/ui/appearance-card";
import { SettingsBillingPanel } from "@/widgets/settings-billing/ui/settings-billing-panel";
import { SettingsNav } from "@/widgets/settings-billing/ui/settings-nav";

type SettingsPageProps = {
  searchParams?: Promise<{
    billing?: string | string[] | undefined;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const user = await requireCurrentUser();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const billingState = Array.isArray(resolvedSearchParams?.billing)
    ? resolvedSearchParams?.billing[0]
    : resolvedSearchParams?.billing;

  const [applicationsUsed, remindersUsed, resumesUsed] = await Promise.all([
    prisma.application.count({ where: { userId: user.id } }),
    prisma.reminder.count({ where: { userId: user.id, completedAt: null } }),
    prisma.resume.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description={`${user.email} · ${PLAN_LABELS[user.plan]} plan`}
        breadcrumb="settings"
      />

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <SettingsNav />

        <div className="flex flex-col gap-7">
          <section
            id="account"
            className="scroll-mt-6 overflow-hidden rounded-card border border-border bg-surface"
          >
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-text">Account</h2>
              <p className="mt-1 text-[12.5px] text-text-3">
                Your DevApply identity. Manage sign-in details from your account
                provider.
              </p>
            </div>
            <div className="divide-y divide-border px-5">
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <h3 className="text-[13.5px] font-medium text-text">Name</h3>
                  <p className="mt-0.5 text-[12.5px] text-text-3">
                    Shown across your workspace.
                  </p>
                </div>
                <span className="text-[13px] text-text-2">
                  {user.name ?? "Not set"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <h3 className="text-[13.5px] font-medium text-text">Email</h3>
                  <p className="mt-0.5 text-[12.5px] text-text-3">
                    Used for sign-in and notifications.
                  </p>
                </div>
                <span className="font-mono text-[12.5px] text-text-2">
                  {user.email}
                </span>
              </div>
            </div>
          </section>

          <AppearanceCard />

          <SettingsBillingPanel
            billingState={billingState}
            plan={user.plan}
            applicationsUsed={applicationsUsed}
            remindersUsed={remindersUsed}
            resumesUsed={resumesUsed}
          />
        </div>
      </div>
    </div>
  );
}
