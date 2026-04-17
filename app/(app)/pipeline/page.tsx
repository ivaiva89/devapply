import { PageHeader } from "@/components/design/page-header";
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
    <>
      <PageHeader
        title="Pipeline"
        description="Drag cards or press 1–4 to move between stages."
        breadcrumb="pipeline"
      />
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
    </>
  );
}
