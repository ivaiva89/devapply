"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-700" htmlFor={`application-${resumeId}`}>
          Attach to application
        </label>
        <select
          id={`application-${resumeId}`}
          name="applicationId"
          disabled={applicationOptions.length === 0 || isPending}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:cursor-not-allowed disabled:bg-stone-100"
          defaultValue=""
        >
          <option value="" disabled>
            {applicationOptions.length > 0
              ? "Select an application"
              : "No applications available"}
          </option>
          {applicationOptions.map((application) => (
            <option key={application.id} value={application.id}>
              {application.label}
            </option>
          ))}
        </select>
      </div>
      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={applicationOptions.length === 0 || isPending}
        className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
      >
        {isPending ? "Attaching..." : "Attach resume"}
      </button>
    </form>
  );
}
