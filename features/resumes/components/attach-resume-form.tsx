"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AttachResumeFormPresenter } from "@/features/resumes/components/attach-resume-form-presenter";
import {
  attachResumeToApplication,
  type AttachResumeActionState,
} from "@/features/resumes/server/attach-resume";
import type { ResumeApplicationOption } from "@/features/resumes/types";

type AttachResumeFormProps = {
  applicationOptions: ResumeApplicationOption[];
  resumeId: string;
};

const initialState: AttachResumeActionState = {
  status: "idle",
};

export function AttachResumeForm({
  applicationOptions,
  resumeId,
}: AttachResumeFormProps) {
  const router = useRouter();
  const action = attachResumeToApplication.bind(null, resumeId);
  const [state, formAction, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <AttachResumeFormPresenter
      action={formAction}
      applicationOptions={applicationOptions}
      error={state.error}
      isPending={isPending}
      resumeId={resumeId}
    />
  );
}
