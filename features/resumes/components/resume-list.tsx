import { AttachResumeForm } from "@/features/resumes/components/attach-resume-form";
import { ResumeListPresenter } from "@/features/resumes/components/resume-list-presenter";
import type { ResumeApplicationOption, ResumeListItem } from "@/features/resumes/types";

type ResumeListProps = {
  applicationOptions: ResumeApplicationOption[];
  resumes: ResumeListItem[];
};

export function ResumeList({ applicationOptions, resumes }: ResumeListProps) {
  return (
    <ResumeListPresenter
      resumes={resumes}
      renderAttachForm={(resume) => (
        <AttachResumeForm
          applicationOptions={applicationOptions}
          resumeId={resume.id}
        />
      )}
    />
  );
}
