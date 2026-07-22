"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { UploadResumeFormPresenter } from "@/features/resumes/components/upload-resume-form-presenter";
import {
  uploadResume,
  type UploadResumeActionState,
} from "@/features/resumes/server/upload-resume";

const initialState: UploadResumeActionState = {
  status: "idle",
};

export function UploadResumeForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    uploadResume,
    initialState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    formRef.current?.reset();
    startTransition(() => {
      router.refresh();
    });
  }, [router, state.status]);

  return (
    <UploadResumeFormPresenter
      action={formAction}
      error={state.error}
      formRef={formRef}
      isPending={isPending}
    />
  );
}
