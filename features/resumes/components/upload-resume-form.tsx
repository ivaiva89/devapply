"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  uploadResume,
  type UploadResumeActionState,
} from "@/features/resumes/server/upload-resume";

type UploadResumeFormProps = {
  canUpload: boolean;
};

const initialState: UploadResumeActionState = {
  status: "idle",
};

export function UploadResumeForm({ canUpload }: UploadResumeFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(uploadResume, initialState);

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
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Upload resume
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-stone-950">
          Add a resume version
        </h2>
        <p className="text-sm leading-6 text-stone-600">
          Upload PDF, DOC, or DOCX files to Blob storage and keep a title you can recognize later.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-stone-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            disabled={!canUpload || isPending}
            placeholder="Backend resume"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="file" className="text-sm font-medium text-stone-700">
            File
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={!canUpload || isPending}
            className="block w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 file:mr-4 file:rounded-full file:border-0 file:bg-stone-950 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white disabled:cursor-not-allowed disabled:bg-stone-100"
            required
          />
        </div>
      </div>
      {state.error ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!canUpload || isPending}
        className="mt-6 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {isPending ? "Uploading..." : "Upload resume"}
      </button>
    </form>
  );
}
