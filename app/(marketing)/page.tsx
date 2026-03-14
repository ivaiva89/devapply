import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { PlaceholderPanel } from "@/components/layout/placeholder-panel";
import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
      <PageShell
        eyebrow="Job Application Tracker"
        title="A structured workspace for high-volume developer job searches."
        description="This repository now starts from an intentional SaaS foundation: marketing routes are separated from the authenticated product area, and the core MVP sections already have stable URLs for incremental implementation."
      >
        <div className="flex flex-wrap gap-3">
          <Button type="button">DevApply primary action</Button>
          <Link
            href="/sign-in"
            className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Sign in to app
          </Link>
          <Link
            href="/applications"
            className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
          >
            Protected application route
          </Link>
        </div>
      </PageShell>
      <div className="space-y-6">
        <PlaceholderPanel
          title="Production-minded default"
          description="The layout is intentionally small, route boundaries are explicit, and shared placeholder components prevent one-off page scaffolding from accumulating."
        />
        <PlaceholderPanel
          title="Ready for next phases"
          description="The next implementation passes can add auth, database access, plan enforcement, and feature-level server modules without reorganizing the app tree again."
        />
      </div>
    </div>
  );
}
