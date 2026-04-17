import { PipelineBoard } from "@/widgets/pipeline-board/ui/pipeline-board";
import { MobilePipeline } from "@/widgets/pipeline-board/ui/mobile-pipeline";
import { PipelineEmptyState } from "@/features/applications/components/pipeline-empty-state";
import { getPipelineColumnsForUser } from "@/features/applications/server/pipeline-board";
import { requireCurrentUser } from "@/features/auth/server/session";

export default async function PipelinePage() {
  const user = await requireCurrentUser();
  const columns = await getPipelineColumnsForUser(user.id);
  const totalApplications = columns.reduce(
    (count, column) => count + column.items.length,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Pipeline
        </p>
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Application pipeline
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Drag applications between stages to keep the authenticated
              user&apos;s funnel current and visible.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {totalApplications}{" "}
            {totalApplications === 1 ? "application" : "applications"}
          </div>
        </div>
      </section>
      {totalApplications > 0 ? (
        <>
          <div className="hidden md:block">
            <PipelineBoard initialColumns={columns} />
          </div>
          <div className="block md:hidden">
            <MobilePipeline initialColumns={columns} />
          </div>
        </>
      ) : (
        <PipelineEmptyState />
      )}
    </div>
  );
}
